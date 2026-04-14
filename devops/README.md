# DevOps

Everything related to CI/CD and hosting lives here.

## Layout

```
project/
├── .gitlab-ci.yml
├── docker-compose.yml        (Swarm deployment, temporary)
├── backend/
├── frontend/
└── devops/
    ├── README.md             (this)
    ├── swarm-setup.md        (details for the current Swarm pipeline)
    ├── scripts/              (Python scripts that deploy to Portainer)
    └── k8s/                  (future — will replace Swarm)
```

## CD in one paragraph

Push to any branch and GitLab CI builds the images, pushes them to the registry, then deploys a Swarm stack via Portainer. Every branch gets its own stack at `https://gr8-<branch-slug>.doe25.swarm.chas-lab.dev`. Main has a manual approval gate for production. Stacks are cleaned up automatically when the MR closes.

Full details: [swarm-setup.md](swarm-setup.md).

> Swarm is a stopgap. We're moving to Kubernetes in a few weeks, at which point `swarm-setup.md` and `docker-compose.yml` go away and everything under `k8s/` takes over.

## Branches

```
feature/* → develop → main
```

| Branch      | Deployed                     |
|-------------|------------------------------|
| `main`      | Production (manual approval) |
| `develop`   | Shared dev environment       |
| `feature/*` | Ephemeral review env per branch |

Only `develop` can merge into `main` (enforced by CI).

## Jira

Use the Jira key in your branch names, commits, and MR titles so things link up:

- Branch: `feature/UT8-42-add-login`
- Commit: `UT8-42 implement auth endpoint`
- MR: `UT8-42: Add user authentication`
