# Grupp GR8

Sebastian, Elina, Daniel, Jonna, Jennifer, Reza, Victoria, Chipego & Anton

See [TECHSTACK.md](TECHSTACK.md) for what we're using.

## Deploys

Every branch gets its own URL on the school's k3s cluster:

- `main` → https://gr8-main.labb.k3s.chas-lab.dev/
- `develop` → https://gr8-develop.labb.k3s.chas-lab.dev/
- `feature/foo` → https://gr8-feature-foo.labb.k3s.chas-lab.dev/

`main` and `develop` keep their database between deploys. Feature branches get cleaned up when the MR is closed.

The Helm chart lives in [`devops/k8s/chart/`](devops/k8s/chart/) and CI runs `helm upgrade` on every push.
