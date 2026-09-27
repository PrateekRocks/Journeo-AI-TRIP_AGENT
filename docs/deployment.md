# Production Deployment Guide

Deploying Journeo safely into production utilizes `docker-compose`. 

## 1. Prerequisites
- Docker Engine >= 20.10.x
- Docker Compose v2.x
- Configured `.env` file containing production-safe API keys.

## 2. Server Requirements
- **Memory**: Minimum 2 GB (Recommended 4 GB+ when handling simultaneous GenAI streaming arrays).
- **Network**: Port 8000 exposed to a reverse proxy (e.g., Nginx, Caddy), or directly depending on VPC routing.

## 3. Build & Deployment Execution

We utilize Docker Compose to establish the internal Bridge Network between the Web Container and the Database.

**Start the stack silently:**
```bash
docker-compose up --build -d
```
This binds:
- The internal Postgres container on Port 5432 (mapped to local context)
- The Python Web API on Port 8000 (accessible host-wide)

**To stop & tear down all services:**
```bash
docker-compose down
```

## 4. Docker Compose Composition
The provided `docker-compose.yml` configures two services:

1. **`db` (postgres:15-alpine)**
   - Holds conversation memory threads securely via a mounted volume `postgres_data:/var/lib/postgresql/data`.
   - Automatic Healthcheck triggers ensuring `pg_isready` before web services initialize.

2. **`web` (journeo frontend/backend)**
   - Mounts local directory `./app` via volume mapping allowing for simple patch pushes without full image rebuilding.
   - Depends structurally on `service_healthy` from the DB cluster.

## 5. Monitoring, Updates, & Restart Procedures

**Viewing Application Logs (Tail format):**
```bash
docker-compose logs -f web
```
**Viewing Database Logs:**
```bash
docker-compose logs -f db
```

**Zero-Downtime(ish) Restart**
If you modify `.env` or configuration states and need to reboot cleanly:
```bash
docker-compose build
docker-compose up -d --no-deps web
```
This reboots only the web socket pipeline while keeping Postgres caches intact.
