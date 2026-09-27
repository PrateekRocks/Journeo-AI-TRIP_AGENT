# Configuration

All configuration is controlled via environment variables. These are loaded from `.env` in local development by libraries like `dotenv` and explicitly injected via Docker Compose in deployed environments.

## API Keys (Required)

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `GOOGLE_API_KEY` | Gemini LLM access key for intelligence. | [Google AI Studio](https://aistudio.google.com/) |
| `TAVILY_API_KEY` | Real-time web search capabilities (Hotels). | [Tavily Dev Portal](https://tavily.com/) |
| `AVIATIONSTACK_API_KEY` | (Or `AVIATION_STACK_API_KEY`) Flights search capabilities. | [AviationStack](https://aviationstack.com/) |
| `OPENWEATHER_API_KEY` | Real-time weather and forecast extraction. | [OpenWeatherMap](https://openweathermap.org/) |

## Infrastructure Settings

| Variable | Description | Default / Example |
|----------|-------------|-------------------|
| `DATABASE_URL` | PostgreSQL connection string. | `postgresql://postgres:user@localhost:5432/travel_db?sslmode=disable` |
| `GOOGLE_MODEL` | Gemini model to execute agent tasks on. | `gemini-3.5-flash` |

## LangSmith Tracing (Optional but Recommended)
Set these if you wish to observe Graph performance, LLM call timings, and trace potential hallucination issues.

| Variable | Description | Default / Example |
|----------|-------------|-------------------|
| `LANGSMITH_TRACING` | Toggles tracing entirely. | `true` |
| `LANGSMITH_ENDPOINT` | Langsmith ingestion URL. | `https://api.smith.langchain.com/` |
| `LANGSMITH_API_KEY` | API authentication for Langchain. | `...` |
| `LANGSMITH_PROJECT` | Project folder in the Langsmith UI. | `Journeo-AI-TRIP_AGENT` |
