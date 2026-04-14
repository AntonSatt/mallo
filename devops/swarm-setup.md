# Docker Swarm CD Setup

Temporary CD pipeline targeting the school's Portainer + Docker Swarm cluster.
Will be replaced by Kubernetes manifests (see `devops/k8s/`) in ~2–3 weeks. Once k8s is in place, this file can be deleted.

---

## Architecture

```
git push to any branch
      ↓
GitLab CI pipeline runs
      ↓ build
images pushed to GitLab Container Registry
      ↓ deploy
deploy.py → Portainer API
      ↓
Portainer creates/updates a Swarm stack for the branch
      ↓
Traefik routes:
  https://project-<branch-slug>.doe25.swarm.chas-lab.dev      → frontend
  https://api.project-<branch-slug>.doe25.swarm.chas-lab.dev  → backend
```

**Stack name:** `project-<CI_COMMIT_REF_SLUG>` (kept short to stay under Swarm's 63-char network name limit).

**Image tag:** `latest` on `main`, otherwise the branch's `CI_COMMIT_REF_SLUG`.

---

## Pipeline stages (`.gitlab-ci.yml`)

1. **test** — `check-merge-source` (only `develop` → `main` allowed)
2. **secret-detection** — GitLab template scan
3. **build** — buildx builds with registry cache:
   - `build frontend` → `$CI_REGISTRY_IMAGE/frontend:<tag>`
   - `build backend` → `$CI_REGISTRY_IMAGE/backend:<tag>`
   - `build python-utils` → `$CI_REGISTRY_IMAGE/python-utils:latest` (runs every push so `deploy` always finds the image)
4. **deploy**
   - `deploy review` — all branches except `main`. Environment `review/$CI_COMMIT_REF_SLUG` with `on_stop: stop_review`.
   - `deploy production` — only on `main`, **manual trigger** (approval gate).
5. **cleanup**
   - `stop_review` — manual teardown. Auto-fires when the MR is merged/closed (GitLab environment `on_stop`).

---

## Deploy scripts (`devops/scripts/`)

- **`deploy.py`** — auths to Portainer, finds the Swarm endpoint, envsubsts `docker-compose.yml`, creates stack if missing else updates it.
- **`delete-stack.py`** — finds the stack by name and deletes it. No-op if already gone.
- **`Dockerfile`** + **`requirements.txt`** — builds the `python-utils` image used as the deploy/stop job runtime.

Both scripts read CI env vars (`CI_PROJECT_NAME`, `CI_COMMIT_REF_SLUG`, `CI_DEFAULT_BRANCH`, `CI_REGISTRY_IMAGE`) plus Portainer credentials.

---

## Docker Compose (`docker-compose.yml`)

Three services deployed per stack:

| Service  | Image                                                | Exposed how                               |
|----------|------------------------------------------------------|-------------------------------------------|
| frontend | `$CI_REGISTRY_IMAGE/frontend:<tag>`                  | Traefik → `<stack>.doe25.swarm.chas-lab.dev`     |
| api      | `$CI_REGISTRY_IMAGE/backend:<tag>`                   | Traefik → `api.<stack>.doe25.swarm.chas-lab.dev` |
| db       | `mcr.microsoft.com/mssql/server:2022-latest`         | internal network only, per-stack volume   |

- `traefik-public` external network (provided by the school swarm) handles ingress.
- `internal` network connects api ↔ db.
- Each stack has its own fresh MSSQL instance (empty DB — the app is responsible for running EF Core migrations on startup).

---

## Required GitLab CI/CD variables

Settings → CI/CD → Variables. Masked, **not** protected (protected = only protected branches; would break feature-branch deploys).

| Key             | Value                                                    |
|-----------------|----------------------------------------------------------|
| `PORTAINER_URL` | `https://portainer.doe25.swarm.chas-lab.dev/api`         |
| `PORTAINER_USR` | personal Portainer account (from teacher)                |
| `PORTAINER_PWD` | personal Portainer password (from teacher)               |
| `DB_PASSWORD`   | any strong MSSQL SA password                             |

`PORTAINER_USR` can't be masked if < 8 chars — that's fine, it's not a secret.

---

## How to deploy a branch

Just `git push`. The pipeline runs automatically. Once green, visit:
`https://project-<branch-slug>.doe25.swarm.chas-lab.dev`

## How to tear down a stack

**Automatic:** close or merge the MR — GitLab fires the `stop_review` job, which calls `delete-stack.py`.

**Manual:** GitLab → **Deployments → Environments** → find the review env → click **Stop**.

---

## Troubleshooting

- **Pipeline shows "Blocked"** — normal. The `stop_review` / production manual jobs make GitLab mark the pipeline as blocked. Deploy review already ran.
- **Backend container keeps restarting with exit 139** — app-level crash. Check the container's Logs tab in Portainer. Most common cause: app tries to seed data before running EF migrations to create the DB. Fix in `Api/Program.cs` by calling `db.Database.MigrateAsync()` before `SeedData.EnsureSeedDataAsync(...)`.
- **"network name must be 63 characters or fewer"** — the stack name plus `_internal` is too long. Shorten the branch name, or edit the `stack_name` format in `deploy.py`.
- **Build fails: `cache-... not found`** — harmless warning on first build of a branch. The cache is seeded by the first successful build.

---

## Migration to Kubernetes (future)

When k8s is ready, replace:

- `docker-compose.yml` → manifests in `devops/k8s/`
- `deploy.py` / `delete-stack.py` → `kubectl apply` / `kubectl delete` (or helm)
- Traefik labels → Ingress resources
- `python-utils` image → `bitnami/kubectl` or similar
- Portainer CI variables → kubeconfig secret

Pipeline stage structure (build → deploy → cleanup) stays the same.
Delete this file when the migration is complete.
