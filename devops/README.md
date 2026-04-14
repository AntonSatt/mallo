# DevOps

## Project Structure

```
project/
├── README.md
├── .gitlab-ci.yml
├── docker-compose.yml          ← current: Swarm deployment compose
├── .env.example
├── backend/
├── frontend/
└── devops/
    ├── README.md               ← this file
    ├── swarm-setup.md          ← current CD setup (Portainer + Docker Swarm). Temporary.
    ├── scripts/                ← Python deploy/delete scripts for Portainer
    └── k8s/                    ← Kubernetes manifests (future replacement for Swarm)
```

## CD Pipeline

Continuous Deployment is set up in GitLab CI → Portainer (Docker Swarm) with Traefik routing.
One deployed stack per branch (main, develop, every feature branch). Production deploys are gated by a manual approval step.

See **[swarm-setup.md](swarm-setup.md)** for full details: architecture, pipeline stages, required CI variables, teardown, troubleshooting.

> ⚠️ The Swarm setup is temporary. We're migrating to Kubernetes in ~2–3 weeks. When that happens, `swarm-setup.md` and `docker-compose.yml` will be replaced by manifests in `k8s/`.

## Branch Strategy

```
feature/* → develop → main
```

| Branch      | Purpose                                 | Deployed?               |
|-------------|-----------------------------------------|-------------------------|
| main        | Production                              | Yes, manual approval    |
| develop     | Integration / shared dev environment    | Yes, automatic          |
| feature/*   | Individual features, branched off develop | Yes, automatic review env |

Only `develop` can be merged into `main` (enforced by the `check-merge-source` CI job).

## Jira Integration

Include the Jira issue key in your work:

- Branch: `feature/UT8-42-add-login`
- Commit: `UT8-42 implement auth endpoint`
- MR title: `UT8-42: Add user authentication`
