# Journeo / TripMate AI

**Journeo (TripMate AI)** is a multi-agent travel-planning application powered by **LangGraph**, **FastAPI**, and **Gemini 3.5/3.6 Flash**. It uses specialized AI agents to orchestrate flight lookups, hotel recommendations, weather forecasts, budget analysis, and itinerary generation all under human-in-the-loop (HITL) supervision.

## 🌟 Key Features
- **Multi-Agent Orchestration**: LangGraph coordinates specialized agents (flight, hotel, weather, budget, itinerary).
- **Supervisor & Guardrails**: Automatically filters out non-travel queries and routes requests to the right specialist agents.
- **Human-in-the-Loop (HITL)**: Reviews itineraries before generating the final travel plan, allowing iterative user feedback.
- **MCP Client Integration**: Uses the Model Context Protocol (MCP) to seamlessly communicate with Tavily (search), AviationStack (flights), and a custom OpenWeather MCP server.
- **PostgreSQL Persistence**: Remembers conversation states across sessions and worker reloads utilizing LangGraph's PostgreSQL Checkpointer.
- **FastAPI Backend**: Robust asynchronous backend serving a beautiful Jinja2/HTML frontend and stateless APIs.

## 📚 Documentation Directory

Detailed guides for various aspects of the system can be found in the `docs/` directory:

1. [**System Architecture**](file:///docs/architecture.md) — Workflow, multi-agent diagram, and component interaction.
2. [**Configuration & Environment**](file:///docs/configuration.md) — Environment variables and feature toggles.
3. [**Local Development Setup**](file:///docs/setup.md) — Detailed guide for setting up the project locally.
4. [**Production Deployment**](file:///docs/deployment.md) — Comprehensive reference for deploying with Docker and Docker Compose.
5. [**API Documentation**](file:///docs/api.md) — Complete guide on the supported FastAPI endpoints.
6. [**Troubleshooting**](file:///docs/troubleshooting.md) — Common runtime, database, and MCP errors with their solutions.

## 🚀 Quick Start (Locally with Docker)

### 1. Prerequisites
- Docker and Docker Compose installed
- API keys for Google Gemini, Tavily, AviationStack, and OpenWeather

### 2. Configure Environment
Provide the required API keys to your environment. Create a `.env` file at the root based off the requirements in the [Configuration Guide](file:///docs/configuration.md).

### 3. Build & Run
Run the full application cluster (which includes a PostgreSQL instance and the FastAPI web backend):
```bash
docker-compose up --build
```
You can access the UI by navigating to: **http://localhost:8000**

## 🏗️ Project Structure
```text
.
├── app.py                      # FastAPI application, routing, and endpoints
├── backend.py                  # LangGraph orchestrator and Agent logic
├── mcp_client.py               # MCP configurations for Tavily, Weather, and AviationStack
├── custom_weather_mcp_server.py # Built-in script running a weather MCP Service
├── docker-compose.yml          # Container configuration (web + postgres db)
├── Dockerfile                  # Web backend construction
├── requirements.txt            # Python dependencies
├── docs/                       # Comprehensive modular documentation (Architecture, API, etc.)
├── static/                     # Frontend static assets (CSS, JS)
├── templates/                  # Frontend HTML templates (Jinja2)
└── tools/                      # Fallback / manual search tools
```

## 🔮 Future Improvements
* **Enhanced Frontend**: Migrate the frontend to a fully detached Next.js client (CORS middleware is already configured).
* **Extended MCP Capabilities**: Add automated booking tools.
* **Authentication**: Add JWT validation or OAuth providers mapping to the Thread ID.

## 📄 License
*Closed Source / Unlicensed* - Ensure you check with project maintainers before distributing.
