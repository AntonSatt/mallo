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
feature/* → develop → staging → main
```

| Branch      | Purpose                          | Protected | Hosted            |
|-------------|----------------------------------|-----------|-------------------|
| main        | Production, deployed to live site | Yes       | Production URL    |
| staging     | Pre-production testing           | Yes       | Staging URL       |
| develop     | Integration branch               | Yes       | —                 |
| feature/*   | Individual features, branched off develop | No   | —                 |
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

## Jira Integration

New feature! We now have Jira integrated into our project! 

Using it:

From this point, just include the Jira issue key in your work:

- Branch name example: `feature/UT8-42-add-login`
- Commit message: `UT8-42 implement auth endpoint`
- MR title: `UT8-42: Add user authentication`


