# CoffeeFlow — NestJS Microservices Training

Small, feature-driven backend lab. **F00 Foundation** gives us six independent NestJS applications, one private PostgreSQL container, a single public Gateway port, Docker Compose, health checks, and baseline GitHub Actions CI.

## F00 apps

| App | Docker DNS | Port accessible from the host? |
|---|---|---|
| Gateway | `gateway:3000` | **Yes**, `localhost:3010` by default |
| Identity | `identity:3000` | No |
| Catalog | `catalog:3000` | No |
| Orders | `orders:3000` | No |
| Notifications | `notifications:3000` | No |
| Analytics | `analytics:3000` | No |
| PostgreSQL | `postgres:5432` | No |

In F00, the Gateway is **not yet a router**. Only `/health/live` exists on each NestJS app. HTTP routing is **F01**; Identity authentication is **F02**. The rest of the feature roadmap is in `docs/coffee-flow-roadmap.md`.

## Prerequisites

- Windows PowerShell, Node.js **22+** and npm, Git, Docker Desktop with `docker compose`, and GitHub CLI (`gh`) for publishing.
- Existing Node 22.22.1/2 works for this **NestJS 11 starter**, because no latest NestJS 12 generators are invoked. For new NestJS 12 CLI generators later, update to the supported Node version first.

## First-time setup

```powershell
Copy-Item .env.example .env
# Edit .env and replace POSTGRES_PASSWORD before running Compose.
npm install
npm run format
npm run format:check
npm run lint:check
npm run build
npm run test:unit
npm run verify:config
```

The companion ZIP script `01-bootstrap.ps1` performs these actions and creates the clean F00 commits automatically. A generated `.env` is **never** tracked by Git.

## Start containers and verify

```powershell
docker compose up --build -d
docker compose ps
Invoke-RestMethod http://localhost:3010/health/live
npm run smoke
```

Only the Gateway can be accessed directly from the host; smoke tests use `docker compose exec gateway` to call each private service over Docker DNS.

## Useful commands

```powershell
docker compose logs --tail=80 gateway
docker compose logs --tail=80 postgres
docker compose ps
docker compose down
# WARNING: deletes PostgreSQL's training data:
docker compose down -v
```

## Run local checks

```powershell
npm run format:check
npm run lint:check
npm run build
npm run test:unit
npm run verify:config
```

### Configuration validation

For every service, `SERVICE_NAME` must match the app and `PORT` must be a valid TCP port. Missing or incorrect values cause a clear startup failure. Health endpoints check process liveness, not database readiness. PostgreSQL has its own native readiness check.

## Next features

F01: API Gateway forwarding (REST). F02: Identity and JWT. F03: Catalog and indexes/pagination. F04: Orders and gRPC. F05: Kafka/Analytics. F06: RabbitMQ/Notifications. F07: reliability. F08: million records and DB plans. F09: monitoring. F10: load tests. F11: CI/CD delivery.

## Branch and commit conventions

Feature branch `chore/f00-foundation`, then merge by pull request after CI passes. Commit messages use Conventional Commits. Full acceptance criteria: `docs/features/F00-foundation.md`.
