# TASK-019: Add docker-compose for Local Development

## Summary
There is no `docker-compose.yml` in the repository. Developers who want to run the application in a container locally (matching the production nginx setup) must manually build and run Docker commands. A `docker-compose.yml` file reduces friction.

## Proposed `docker-compose.yml`

```yaml
version: '3.9'

services:
  library-editor:
    build:
      context: .
      dockerfile: dockerfile
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=local
    restart: unless-stopped
```

## Optional: Development Mode Service

Add a second service for hot-reload development:

```yaml
  library-editor-dev:
    image: node:22-alpine
    working_dir: /app
    volumes:
      - .:/app
      - /app/node_modules
    command: npm start
    ports:
      - "4300:4300"
    environment:
      - NODE_ENV=local
```

## Acceptance Criteria
- [ ] `docker-compose.yml` exists at the repo root.
- [ ] `docker compose up` builds the image and serves the app at `http://localhost:8080`.
- [ ] `README.md` (or `AGENT.MD`) documents the `docker compose` command.

## Files to Change
- `docker-compose.yml` (new)
- `README.md` or `AGENT.MD` (add usage instructions)

## Priority
**Low** — developer experience.
