# gr8 Helm chart

Deploys the Grupp GR8 stack (api + frontend + mssql) into the school k3s cluster, namespace `doe25-group-8`. One Helm release per branch — release name == `gr8-${CI_COMMIT_REF_SLUG}`.

The chart itself is namespace-agnostic — namespace is passed via `helm --namespace`, not baked into templates. Reusable for any namespace if the cluster's wildcard cert and ingress class match.

## Render and dry-run locally

```bash
helm lint ./

helm template gr8-test ./ \
  --namespace doe25-group-8 \
  --set image.tag=test \
  | kubectl apply --dry-run=client -f -
```

## One-time namespace bootstrap

These two Secrets are created **out-of-band** (not by the chart, not by CI). Re-run only when rotating credentials.

### 1. Image pull secret

Create a GitLab project deploy token with `read_registry` scope, then:

```bash
kubectl -n doe25-group-8 create secret docker-registry gitlab-registry \
  --docker-server=registry.git.chas-lab.dev \
  --docker-username='<deploy-token-username>' \
  --docker-password='<deploy-token-password>'
```

### 2. App secrets

```bash
kubectl -n doe25-group-8 create secret generic gr8-secrets \
  --from-literal=DB_PASSWORD='<strong password>' \
  --from-literal=Jwt__Key='<32+ char random>' \
  --from-literal=Email__SmtpUser='<smtp user>' \
  --from-literal=Email__SmtpPassword='<smtp password>'
```

The chart references this Secret via:
- `valueFrom.secretKeyRef` for `DB_PASSWORD` (used in connection string and as `MSSQL_SA_PASSWORD`)
- `envFrom.secretRef` for everything else (.NET binds `Jwt__Key`, `Email__SmtpUser`, etc. via env-var configuration automatically)

### 3. Firebase service account

Used by the api for push notifications to offline users (SignalR handles online realtime; Firebase Admin SDK handles offline FCM dispatch). Get the JSON from Firebase Console → Project Settings → Service accounts → "Generate new private key", then:

```bash
kubectl -n doe25-group-8 create secret generic gr8-firebase \
  --from-file=firebase-adminsdk.json=/path/to/firebase-adminsdk.json
```

The api Deployment mounts this Secret at `/secrets/firebase/firebase-adminsdk.json` (readOnly) and sets `Firebase__ServiceAccountPath` to that path. Kept separate from `gr8-secrets` because that one is consumed via `envFrom`, which would turn the JSON blob into a malformed env var.

One Secret serves both `gr8-develop` and `gr8-main` (same namespace).

## Deploy

```bash
helm upgrade --install gr8-${CI_COMMIT_REF_SLUG} ./ \
  --namespace doe25-group-8 \
  --set image.tag=${CI_COMMIT_REF_SLUG} \
  --wait --timeout 5m --atomic
```

Manual rollback:

```bash
helm rollback gr8-${CI_COMMIT_REF_SLUG} -n doe25-group-8
```

## Cleanup (feature branches only)

`helm uninstall` does not delete StatefulSet PVCs. Run both:

```bash
helm uninstall gr8-${slug} -n doe25-group-8
kubectl -n doe25-group-8 delete pvc -l app.kubernetes.io/instance=gr8-${slug}
```

**Never** run this for `gr8-main` or `gr8-develop` — those PVCs hold persistent data.

## URLs

- Frontend: `https://gr8-${slug}.cc.k3s.chas-lab.dev/`
- API:      `https://gr8-${slug}.cc.k3s.chas-lab.dev/api`

TLS is handled at the cluster's Traefik via the wildcard `*.cc.k3s.chas-lab.dev` cert. The Ingress declares no `spec.tls` block.

## Architecture notes

- **Single-host + path routing**: frontend at `/`, backend at `/api` (Traefik `Middleware` strips the prefix). This avoids the wildcard-cert depth limit (`api.gr8-foo.labb...` is two levels deep and would NOT be covered).
- **Per-release naming**: every resource is named `gr8-${slug}-<component>`. Multiple branches coexist in one namespace via labels (`app.kubernetes.io/instance=gr8-${slug}`).
- **DB persistence**: StatefulSet `volumeClaimTemplates` produces `data-gr8-${slug}-db-0` PVCs on `longhorn`. Persistent for `main`/`develop`; deleted on MR close for `feature/*`.
- **Migrations** currently run in app startup (`MigrateAsync()` in `Program.cs`) and rely on EF Core's distributed lock. Safe with `replicas: 1`. Before scaling up, extract to a Helm `pre-upgrade` Job.

## Frontend `VITE_API_BASE_URL`

Because we're single-host with path routing, set `VITE_API_BASE_URL` at build time to a relative path:

```
VITE_API_BASE_URL=/api
```

Set in CI (`.gitlab-ci.yml`, build stage). No CORS needed (same origin).
