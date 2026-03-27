# DevOps

## Project Structure

```
project/
├── README.md
├── .gitlab-ci.yml
├── docker-compose.yml
├── .env.example
├── backend/
├── frontend/
└── devops/
    └── k8s/                ← Kubernetes manifests (future)
```

## Branch Strategy

```
feature/* → development → stage → main
```

| Branch      | Purpose                          | Protected | Hosted            |
|-------------|----------------------------------|-----------|-------------------|
| main        | Production, deployed to live site | Yes       | Production URL    |
| stage       | Pre-production testing           | Yes       | Staging URL       |
| development | Integration branch               | Yes       | —                 |
| feature/*   | Individual features, branched off development | No | —            |
| devops      | CI/CD and infrastructure work    | No        | —                 |

## CI/CD Pipeline

Current `.gitlab-ci.yml` (placeholder):

```yaml
stages:
  - test

placeholder:
  stage: test
  script:
    - echo "Pipeline OK"
```

This is a temporary pipeline to satisfy GitLab's "Pipeline must succeed" merge check. It will be replaced with real jobs (linting, testing, building, deploying) as the project progresses.
