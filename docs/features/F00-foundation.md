# F00 — Repository & Docker Foundation

## Objective

Create a clean, testable NestJS monorepo for CoffeeFlow. Six minimal applications should start locally through Docker Compose, with service discovery by Docker network name, one PostgreSQL container for later service-owned schemas, basic health endpoints, and a small CI pipeline. Do **not** implement business features yet.

---

## Domain Model

No business entities in F00. Each application has only configuration and a health endpoint. Feature-owned tables and database schemas are introduced later.

---

## Business Rules

1. The API Gateway is the **only public application HTTP entrypoint**. Internal services are not published on host ports (local debugging exceptions must be documented).
2. Services communicate using Docker service names and environment variables, not hard-coded IPs.
3. Each service has its own app module/config and must boot independently.
4. No secrets in Git; commit `.env.example` only. Later services own their schemas; no cross-service DB access.
5. Containers must support graceful shutdown; health means the process is alive, not that every dependency is healthy.

---

## Feature Boundaries

### In Scope

- NestJS monorepo `apps/gateway`, `apps/identity`, `apps/catalog`, `apps/orders`, `apps/notifications`, `apps/analytics`.
- Basic startup per application, one `GET /health/live` endpoint each, structured startup logs.
- `Dockerfile`, `.dockerignore`, Docker Compose for six services and PostgreSQL with a persistent local volume and healthcheck.
- `.gitignore`, `.env.example`, root scripts, README with setup/start/stop/logs commands.
- Baseline GitHub Actions CI: install from lockfile, format check, lint check, build, unit tests.
- A basic smoke script that checks the public Gateway liveness route and uses container-network requests to check internal services.

### Out of Scope

- Routing, authentication, product/order APIs, DB tables/migrations, Kafka, RabbitMQ, Redis, Grafana, k6, production deployment and real CD.

---

## API

### Gateway liveness

```http
GET /health/live
```

Response — 200:

```json
{ "status": "ok", "service": "gateway" }
```

### Internal service liveness (container network only)

```http
GET /health/live
```

Response — 200 (example):

```json
{ "status": "ok", "service": "catalog" }
```

The same response shape applies to each app. The actual port and internal hostname are configured by environment variables.

---

## Persistence

### Database

PostgreSQL (one local Docker container with persistent development-only volume). **No tables or ORM models in this feature.** Later features introduce owner-specific schemas and Sequelize migrations.

### Tables

```text
None in F00
```

### Requirements

- PostgreSQL passes a native readiness/health check before dependent startup where needed.
- Connection details come from environment variables; no committed credentials.

---

## Architecture

```text
coffee-flow/
├── apps/
│   ├── gateway/
│   ├── identity/
│   ├── catalog/
│   ├── orders/
│   ├── notifications/
│   └── analytics/
├── libs/                    # contracts added by later features
├── infra/docker-compose.yml
├── Dockerfile
├── .dockerignore
├── .env.example
├── .github/workflows/ci.yml
├── docs/features/F00-foundation.md
├── scripts/smoke.sh
└── README.md
```

### Dependencies

F00 may depend on NestJS, Node.js/npm, Docker Compose and PostgreSQL. Applications must **not** import other applications' source folders or share their future database models.

---

## Redis & Queue

```text
Redis: Not required
Queue: Not required
Kafka: Not required
RabbitMQ: Not required
```

---

## Acceptance Criteria

- [ ] Six NestJS applications start from the same repository without source duplication.
- [ ] `docker compose up --build -d` brings up six service containers and PostgreSQL.
- [ ] The Gateway is externally reachable; internal services have no host HTTP port mapping.
- [ ] Gateway `GET /health/live` returns HTTP 200 and an expected JSON body.
- [ ] Every internal service exposes the same liveness contract on its Docker network.
- [ ] PostgreSQL healthcheck passes and its development data volume persists across restarts.
- [ ] `.env.example` documents variables; no actual secrets are tracked.
- [ ] GitHub Actions runs format check, lint check, build and unit tests on pull requests and main.
- [ ] README enables a new developer to start, inspect logs and shut down the stack.

---

## Tests

1. Unit: service health handler returns correct service identifier.
2. Smoke: Gateway responds on the published port.
3. Container-network smoke: each internal service responds to liveness check.
4. Configuration: missing essential environment variables fail clearly at startup.
5. CI: a deliberately failing lint or unit test produces a failed job (verified before merging).

---

## Definition of Done

- [ ] Domain model: N/A (no business entities in F00).
- [ ] Database migration: N/A until feature-owned tables are introduced.
- [ ] API implemented: liveness only.
- [ ] Business rules: networking and configuration boundaries enforced.
- [ ] Validation: required environment configuration validated.
- [ ] Required tests implemented.
- [ ] No out-of-scope functionality introduced.
- [ ] Feature is ready for F01 — Gateway Routing.
- [ ] Scoped Conventional Commits, clean working tree, green CI.

---

## Proposed commits

```text
chore(repo): initialize NestJS monorepo and service skeletons
chore(docker): run services and PostgreSQL with Compose
test(health): add liveness unit and smoke tests
ci: add baseline checks workflow
docs: document local environment and bootstrap
```
