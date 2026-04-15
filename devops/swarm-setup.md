# Swarm setup

Notes on how the current CD pipeline works. We're on the school's Portainer + Docker Swarm for now, moving to Kubernetes later. Delete this file when we do.

## How it flows

Push to any branch → GitLab CI builds the images and pushes them to the GitLab registry → `deploy.py` talks to Portainer and creates (or updates) a Swarm stack for that branch → Traefik picks up the new services and gives them a URL.

Stack name is `gr8-<branch-slug>`. Has to be short because Swarm caps network names at 63 chars and it appends `_internal` to ours.

Image tag is `latest` on main, otherwise the branch slug.

## Pipeline

`.gitlab-ci.yml` has these stages:

- `test` — the old check that only lets develop merge into main
- `secret-detection` — GitLab's built-in scan
- `build` — builds frontend, backend, and the python-utils image. Uses buildx with registry cache so rebuilds are fast.
- `deploy`
  - `deploy review` runs automatically on every branch except main
  - `deploy production` only on main, and it's manual (approval gate)
- `cleanup`
  - `stop_review` tears down the stack. Manual in the UI, but GitLab also fires it automatically when the MR closes.

## Scripts

In `devops/scripts/`:

- `deploy.py` — logs into Portainer, looks up the Swarm endpoint, envsubsts the compose file, then either creates the stack or updates it if one with the same name already exists.
- `delete-stack.py` — finds the stack by name and deletes it. No-op if it's already gone.
- `Dockerfile` + `requirements.txt` — builds the `python-utils` image. The deploy and stop jobs use this as their runtime image so we don't have to `pip install` on every run.

Both scripts read the usual GitLab CI env vars plus the Portainer credentials.

## docker-compose.yml

Three services:

- `frontend` — nginx serving the Vite build. Routed by Traefik to `gr8-<branch>.doe25.swarm.chas-lab.dev`.
- `api` — the .NET backend. Routed to `api.gr8-<branch>.doe25.swarm.chas-lab.dev`.
- `db` — MSSQL 2022. Internal only, not exposed. Each stack gets its own fresh empty DB and its own volume.

Networks: `traefik-public` is external and provided by the school swarm. `internal` is just so api can reach db.

## Required GitLab variables

In Settings → CI/CD → Variables. Masked, **not** protected (if you mark them protected they only work on protected branches, which breaks feature branch deploys):

| Key             | What                                              |
|-----------------|---------------------------------------------------|
| `PORTAINER_URL` | `https://portainer.doe25.swarm.chas-lab.dev/api`  |
| `PORTAINER_USR` | Your Portainer username (from the teacher)        |
| `PORTAINER_PWD` | Your Portainer password (from the teacher)        |
| `DB_PASSWORD`   | Some strong MSSQL SA password                     |

If your username is under 8 chars GitLab won't let you mask it. That's fine, a username isn't really a secret.

## Deploying

Just push. Pipeline runs, and when it's green the site is at `https://gr8-<branch-slug>.doe25.swarm.chas-lab.dev`. You can also open GitLab → Operate → Environments, there's a link icon there.

## Tearing down

Close or merge the MR and GitLab runs `stop_review` automatically. If you want to nuke a stack manually, GitLab → Deployments → Environments → Stop. Or just delete it in Portainer directly.

## Things that will probably go wrong

- **Pipeline shows "Blocked"** — not actually broken. It's waiting on the manual jobs (production deploy, stop_review). Your review deploy already ran.
- **Backend keeps restarting (exit 139)** — this is a .NET crash, not a pipeline issue. Check container logs in Portainer. Usually it's the app trying to seed data before the DB exists. Fix is on the .NET side: run EF migrations before `SeedData.EnsureSeedDataAsync` in `Program.cs`.
- **"network name must be 63 characters or fewer"** — branch name is too long. Rename it or change the `stack_name` format in `deploy.py`.
- **First build warns `cache-... not found`** — ignore, the cache doesn't exist yet on a brand-new branch.

## When we move to k8s

Stuff to replace:

- `docker-compose.yml` → manifests in `devops/k8s/`
- `deploy.py` / `delete-stack.py` → probably just `kubectl apply` / `kubectl delete`, or helm
- Traefik labels → Ingress
- `python-utils` image → something like `bitnami/kubectl`
- Portainer vars → a kubeconfig secret

The stage layout (build → deploy → cleanup) should stay the same. Delete this file once the migration is done.
