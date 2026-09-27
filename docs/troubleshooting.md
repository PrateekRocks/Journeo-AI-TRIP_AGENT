# Troubleshooting

This document outlines common deployment, configuration, and runtime issues.

## 1. AviationStack / UV Tool Errors

**Symptom**: Flight searches fail with `AviationStack MCP error` or `uvx was not found`. Flight data falls back to mock or offline fallback tools.
**Cause**: The application uses Astral's `uvx` package executor to run the `aviationstack-mcp` service dynamically. If `uv` is not installed on the system (or inside the Docker container), the MCP process cannot launch.
**Fix**:
If outside Docker, run the install script: `curl -LsSf https://astral.sh/uv/install.sh | sh`. 
If inside Docker, ensure your `Dockerfile` explicitly installs `uv` (`pip install uv`).

## 2. Database Connection Errors

**Symptom**: `psycopg.OperationalError: connection to server at ... failed`
**Cause**: The application cannot reach PostgreSQL. When using `docker-compose`, if `DATABASE_URL` specifies `localhost`, the web container will try connecting to ITSELF instead of the Postgres container.
**Fix**: Ensure your `docker-compose.yml` injects the correct host mapped to the compose network:
`DATABASE_URL=postgresql://postgres:postgrespassword@db:5432/travel_db?sslmode=disable`

## 3. UI Does Not Auto-Reload on Code Changes

**Symptom**: You update `app.py` or `.html` templates but Docker Compose does not reflect them on browser refresh.
**Cause**: Uvicorn is launched with `--reload`, but there is no file share between your Host OS and the Container image.
**Fix**: Ensure that the `web` setup in your `docker-compose.yml` contains a volume binding pointing your local path to the remote root folder:
```yaml
volumes:
  - .:/app
```

## 4. MCP Key Validation / Null Responses

**Symptom**: Weather or Tavily (Hotel) searches consistently return empty datasets or rate limit warnings.
**Cause**: You might be utilizing exhausted Free Tiers for Tavily or OpenWeather, or missing the variable completely in your `.env`.
**Fix**: Inspect Langsmith traces or check container output: `docker-compose logs web`. Both services emit visible `401 Unauthorized` or `429 Too Many Requests` directly to the `mcp_client.py` log stream. Update key arrays accordingly.

## 5. UI Returns "Message Box Empty"

**Symptom**: Webpage refuses to connect or returns code `400: Message cannot be empty` upon first request despite typing.
**Cause**: NextJS/Web component mismatch payload.
**Fix**: Wait for the Uvicorn terminal loop to finish spinning up components before hitting 'Submit' or refer to CORS setups in `app.py`.
