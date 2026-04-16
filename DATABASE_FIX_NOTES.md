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

- Dockerfile is fine, unchanged.
- CI pipeline is fine, unchanged — we chose in-app migration over a separate migration job because Swarm runs api at `replicas: 1`, so there's no concurrent-migration race.

## Future / when moving to K8s

Microsoft's own guidance is that in-process `Migrate()` on boot is pragmatic for dev/staging but not recommended for production at scale (schema-modification rights on the app's DB user, no human review of SQL before apply, replica race without EF 9's locking). When migrating to K8s, extract this into a dedicated migration Job / init container that runs once before the api Deployment rolls out, and drop the `Migrate()` call from `Program.cs`.

## Delete this file

Once everything's merged to `main` and the fix is stable, this note can go.
