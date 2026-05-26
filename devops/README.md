# devops

CI/CD and Kubernetes deploy for Mallo. For the big picture (architecture, stack, screenshots) see the [project README](../README.md).

## What lives here

```
devops/
├── README.md             this file
├── swarm-setup.md        historical: the retired Portainer + Swarm pipeline
└── k8s/
    ├── manifests/        plain YAML, applied with kubectl
    │   ├── api-deployment.yaml
    │   ├── api-service.yaml
    │   ├── db-statefulset.yaml
    │   ├── db-service.yaml
    │   ├── frontend-deployment.yaml
    │   ├── frontend-service.yaml
    │   ├── ingress.yaml
    │   └── middleware.yaml          Traefik strip-prefix for /api
    └── chart/            slim Helm chart: Bitnami Redis + observability glue
        ├── Chart.yaml
        ├── Chart.lock
        ├── values.yaml
        └── templates/
            ├── api-servicemonitor.yaml
            ├── api-prometheusrule.yaml
            ├── api-grafana-dashboard.yaml
            └── _helpers.tpl
```

We split the deploy on purpose. The app, the database, and the ingress are plain manifests because anyone on the team can read a `Deployment` without first learning Helm. The chart only carries the parts we don't own (Bitnami Redis as a sub-chart) and the observability resources (`ServiceMonitor`, `PrometheusRule`, Grafana dashboard `ConfigMap`) that benefit from templated release naming.

## Pipeline

Defined in [`/.gitlab-ci.yml`](../.gitlab-ci.yml). Five stages:

| Stage | What it does |
|---|---|
| `test` | `check-merge-source` enforces that only `develop` can merge into `main`. Frontend/backend test jobs are placeholders waiting for real Vitest/xUnit suites. |
| `secret-detection` | GitLab's built-in template, every pipeline. |
| `build` | `docker buildx` for the frontend and backend images. Tag is `latest` on `main`, otherwise `CI_COMMIT_REF_SLUG`. Registry cache (`cache-<tag>` + `cache-latest`) keeps rebuilds fast. |
| `deploy` | Rewrites the manifests with `sed`, `kubectl apply -f`, `rollout restart`, then `helm upgrade --install` for the chart. |
| `smoke-test` | Polls `${ENV_URL}/api/openapi/v1.json` every 5s for 5 minutes. Any HTTP response counts as up. Only 502/503/504 and connection failures count as down. The 5-minute window covers MSSQL cold-starting and EF re-applying migrations. |

The `workflow:` block keeps exactly one pipeline per commit: the MR pipeline if an MR is open (so deploy + smoke-test gate the merge button), otherwise the branch pipeline. `auto_cancel: on_new_commit: interruptible` kills the older pipeline's interruptible jobs when a new commit lands so rapid pushes don't pile up.

## Branches → environments

| Branch | Image tag | URL | What happens |
|---|---|---|---|
| `main` | `:latest` | https://gr8-main.cc.k3s.chas-lab.dev/ | `deploy production` is manual (approval gate). Persistent DB. |
| `develop` | `:develop` | https://gr8-develop.cc.k3s.chas-lab.dev/ | Auto-deploys on every push. Persistent DB. |
| `feature/*` | `:<slug>` | not auto-deployed | Image is built and pushed so anyone can pull it, but no deploy job runs. |

Everything lives in one namespace (`doe25-group-8`) on the school's k3s cluster.

## The `gr8-plain` rewrite

The plain manifests are checked in with `gr8-plain` baked in as the release identifier. CI rewrites it per environment right before `kubectl apply`:

```bash
# develop
sed -i 's|gr8-plain|gr8-develop|g' devops/k8s/manifests/*.yaml

# main (also swaps :develop image tags for :latest)
sed -i 's|gr8-plain|gr8-main|g; s|backend:develop|backend:latest|g; s|frontend:develop|frontend:latest|g' \
    devops/k8s/manifests/*.yaml
```

That single substitution covers resource names, selectors, the `app.kubernetes.io/instance` label, the ingress host, the CORS origin in the API, and the Traefik middleware reference. Develop and main coexist in the same namespace and stay apart by name + label.

If you add a manifest, use `gr8-plain` consistently (resource name, selectors, label, hostname) and the rewrite will pick it up.

## Bootstrap (one-time per namespace)

Two Secrets are created out of band. They never live in Git and CI never templates them.

```bash
# 1. Image pull secret. Use a GitLab project deploy token with read_registry scope.
kubectl -n doe25-group-8 create secret docker-registry gitlab-registry \
  --docker-server=registry.git.chas-lab.dev \
  --docker-username='<deploy-token-username>' \
  --docker-password='<deploy-token-password>'

# 2. App secrets. The API picks these up via envFrom + a secretKeyRef on DB_PASSWORD.
kubectl -n doe25-group-8 create secret generic gr8-secrets \
  --from-literal=DB_PASSWORD='<strong password>' \
  --from-literal=Jwt__Key='<32+ char random>' \
  --from-literal=Email__SmtpUser='<smtp user>' \
  --from-literal=Email__SmtpPassword='<smtp password>' \
  --from-literal=REDIS_PASSWORD='<redis password>'
```

CI authenticates against the cluster with `KUBECONFIG_CC_PROJECT_B64`, a base64-encoded kubeconfig stored as a masked GitLab CI variable.

## Required GitLab CI variables

In Settings → CI/CD → Variables. Masked, not protected (protected means "protected branches only" which breaks MR pipelines from feature branches).

| Key | Purpose |
|---|---|
| `KUBECONFIG_CC_PROJECT_B64` | Base64-encoded kubeconfig used by every deploy + smoke-test job. |
| `VITE_MAPBOX_TOKEN` | Mapbox public token, baked into the frontend image at build time. |

The registry credentials (`CI_REGISTRY*`) are provided by GitLab automatically.

## Deploying manually

CI handles deploys end to end. If you ever need to run one by hand against an already-bootstrapped namespace:

```bash
export KUBECONFIG=/path/to/kubeconfig

# plain manifests
sed -i 's|gr8-plain|gr8-develop|g' devops/k8s/manifests/*.yaml
kubectl apply -f devops/k8s/manifests/
kubectl -n doe25-group-8 rollout restart deployment \
  -l app.kubernetes.io/instance=gr8-develop

# chart (Redis + observability)
helm dependency update ./devops/k8s/chart
helm upgrade --install gr8-develop-extras ./devops/k8s/chart \
  --namespace doe25-group-8 --wait --timeout 5m --atomic
```

The `rollout restart` matters: see "Things that bite" below.

## Cleanup

Only ever do this for a feature-branch deploy you spun up by hand. Never for `gr8-main` or `gr8-develop`, the PVCs hold real data.

```bash
SLUG=<feature-slug>
kubectl -n doe25-group-8 delete \
  deployment,statefulset,service,ingress \
  -l app.kubernetes.io/instance=gr8-$SLUG
kubectl -n doe25-group-8 delete middleware.traefik.io \
  -l app.kubernetes.io/instance=gr8-$SLUG
helm uninstall gr8-$SLUG-extras -n doe25-group-8 || true
kubectl -n doe25-group-8 delete pvc \
  -l app.kubernetes.io/instance=gr8-$SLUG
```

`helm uninstall` does not delete StatefulSet PVCs, so the explicit `delete pvc` matters.

## Checks before pushing

```bash
# Chart
helm lint ./devops/k8s/chart
helm template gr8-test ./devops/k8s/chart --namespace doe25-group-8 \
  | kubectl apply --dry-run=client -f -

# Plain manifests (server-side dry-run against the cluster you're pointed at)
kubectl apply --dry-run=server -f devops/k8s/manifests/
```

A YAML editor with the Kubernetes schema attached catches most of the dumb mistakes before any of this. Worth setting up.

## Things that bite

- **`kubectl apply` is a no-op when the manifest is byte-identical to the live resource.** Pushing a new image under the same `:develop` tag does not change the `Deployment` spec, so the pod is not recreated. The CI job runs `rollout restart` right after `apply` for this reason. Skip the restart locally and you'll wonder why your changes aren't live.
- **MSSQL cold-start is slow.** First boot on a fresh PVC runs schema upgrades on `master`, `msdb`, and `model` for about 3 to 4 minutes before port 1433 opens. The pod's `startupProbe` (60 × 10s = 600s) and the smoke test's 5-minute polling window are sized for this. Don't shorten either without a reason.
- **.NET inotify crash on boot.** Without `DOTNET_USE_POLLING_FILE_WATCHER=true` the API pod hits the node's inotify cap during startup and CrashLoops. The env var is set in `api-deployment.yaml`. Don't remove it.
- **Wildcard cert is one subdomain deep.** The cluster's `*.cc.k3s.chas-lab.dev` certificate covers a single level only. `api.gr8-foo.cc.k3s.chas-lab.dev` would NOT be covered. We route the API behind `/api` on the same host (`gr8-<env>.cc.k3s.chas-lab.dev`) and strip the prefix in `middleware.yaml` for that reason.
- **SignalR + multiple API replicas.** The API Service has Traefik sticky-cookie annotations so a WebSocket stays pinned to one pod. We run `replicas: 1` today, but if you ever scale up, also move EF migrations out of `Program.cs` into a Helm `pre-upgrade` `Job`, otherwise two pods race to migrate.
- **Pipeline shows "Blocked".** It's waiting on a manual job (production deploy). Your review/develop deploy already ran.

## History

`swarm-setup.md` documents the Portainer + Docker Swarm setup we used until the move to k3s in May 2026. The root `docker-compose.yml` is from that era too. Neither is wired into the current CI. They're kept around for reference until we're confident we won't roll back.
