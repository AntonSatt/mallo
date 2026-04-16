# Database crash fix — `feature/fix-database-autocreating-db`

## Problem

On the school Swarm the api container crash-looped with exit 139. Portainer logs showed SQL Server error `4060: Cannot open database "CommunityDB" requested by the login`, stack trace ending at `SeedData.cs:16 FindByEmailAsync` → `Program.cs:78`.

Two separate bugs:

1. `docker-compose.yml` said `Database=Gr8`, the app expects `CommunityDB` (see `appsettings.json`, `CommunityDbContext`, all migrations).
2. Nothing in the app, the Dockerfile, or the CI pipeline ever created the `CommunityDB` database or ran EF Core migrations. Local dev works because each .NET dev ran `dotnet ef database update` once on their machine and LocalDB persists that state. The Swarm MSSQL container comes up empty every deploy — so the database literally did not exist, and MSSQL returns 4060 for any login that asks for a missing database.

## Changes

### `docker-compose.yml:35`
`Database=Gr8` → `Database=CommunityDB`. Now matches what the app's connection string already expects locally.

### `backend/Gr8/Api/Program.cs`
Added after `var app = builder.Build();`:

```csharp
using (var scope = app.Services.CreateScope())
{
    await scope.ServiceProvider.GetRequiredService<ApplicationDbContext>().Database.MigrateAsync();
    await scope.ServiceProvider.GetRequiredService<CommunityDbContext>().Database.MigrateAsync();
}
```

`MigrateAsync()` does two things in one call: creates the database if it doesn't exist (EF opens a side connection to `master` and runs `CREATE DATABASE`), then applies every pending migration from `Infrastructure/Persistence/Migrations/`. This is the automated version of what your local dev machines did manually via `dotnet ef database update`.

Also added `using Gr8.Infrastructure.Persistence;` and `using Microsoft.EntityFrameworkCore;`.

### `backend/Gr8/Infrastructure/DependencyInjection.cs`
Added `EnableRetryOnFailure()` to both `UseSqlServer` calls. The api container can start before MSSQL is fully ready — retry gives the api ~1 minute of backoff instead of crashing immediately on transient connection errors.

## What this does NOT touch

- Backend Dockerfile is fine, unchanged.
- We chose in-app migration over a separate migration job because Swarm runs api at `replicas: 1`, so there's no concurrent-migration race.

## Bonus fix: frontend couldn't reach the api (separate bug, same root cause pattern)

After the database fix the api was alive on swarm but login still failed with 404. Cause: `frontend/Gr8/src/api/ApiClient.jsx:5` reads `import.meta.env.VITE_API_BASE_URL`, which Vite inlines **at build time**. Locally the frontend devs each have a gitignored `.env` file with `VITE_API_BASE_URL=http://localhost:5225` that points axios at their local `dotnet run` backend — so it works on their machines. CI clones the repo without any `.env` (it's gitignored), so the variable was undefined and axios sent every request to relative paths on the frontend's own origin → nginx 404.

Same "works on my machine because of state that's invisible to CI" pattern as the database issue.

### Changes

**`frontend/Gr8/Dockerfile`** — accept the URL as a build arg and expose it to Vite:

```dockerfile
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build
```

**`.gitlab-ci.yml`** (`build frontend` job) — pass the per-branch api URL as a build arg:

```yaml
--build-arg VITE_API_BASE_URL="https://api.gr8-${CI_COMMIT_REF_SLUG}.doe25.swarm.chas-lab.dev"
```

Works uniformly for review (`api.gr8-feature-foo...`), develop (`api.gr8-develop...`), and production (`api.gr8-main...`) because the api hostname pattern is `api.<stack_name>.doe25.swarm.chas-lab.dev` (`docker-compose.yml:52-56`) and `stack_name = gr8-${CI_COMMIT_REF_SLUG}` (`devops/scripts/deploy.py:28`).

Cache impact is minor: `npm ci` layer is unaffected, only `npm run build` re-runs when the URL differs.

### Open follow-up for the frontend team

There is **no committed `.env.example`** in `frontend/Gr8/`. Devops can't know which `VITE_*` variables exist without grepping the source. Frontend should add a `.env.example` with every var the app reads, and update it whenever they introduce a new one. That's the contract that lets CI/devops stay in sync without anyone having to ask.

## Bonus fix #2: CORS rejecting the deployed frontend

After fixing the frontend's API base URL, login still failed with "Network Error" in the browser. Network tab showed the preflight `OPTIONS` returning `204` but no follow-up `POST` — classic browser-side CORS rejection.

`backend/Gr8/Api/Program.cs` hardcoded the allowed origin to `http://localhost:5173`. Locally that works because the frontend dev server runs there. On swarm the frontend origin is `https://gr8-<branch>.doe25.swarm.chas-lab.dev`, which wasn't in the allow-list, so the browser blocked the actual request after the preflight.

### Changes

**`backend/Gr8/Api/Program.cs`** — read allowed origins from configuration instead of hardcoding:

```csharp
var corsOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                  ?? new[] { "http://localhost:5173" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApplication", policy =>
    {
        policy.WithOrigins(corsOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
```

Default fallback is `localhost:5173` so local dev keeps working without setting any env var.

**`docker-compose.yml`** — set the per-stack origins via env vars:

```yaml
- Cors__AllowedOrigins__0=https://${stack_name}.doe25.swarm.chas-lab.dev
- Cors__AllowedOrigins__1=http://localhost:5173
```

`${stack_name}` is already substituted by `deploy.py` to `gr8-${CI_COMMIT_REF_SLUG}`, so each branch's api gets the correct frontend origin in its allow-list automatically. Localhost is kept in slot 1 so devs can still hit a deployed api from their local frontend if they ever want to.

## Future / when moving to K8s

Microsoft's own guidance is that in-process `Migrate()` on boot is pragmatic for dev/staging but not recommended for production at scale (schema-modification rights on the app's DB user, no human review of SQL before apply, replica race without EF 9's locking). When migrating to K8s, extract this into a dedicated migration Job / init container that runs once before the api Deployment rolls out, and drop the `Migrate()` call from `Program.cs`.

## Delete this file

Once everything's merged to `main` and the fix is stable, this note can go.
