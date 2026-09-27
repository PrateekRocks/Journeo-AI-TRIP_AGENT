# Local Development Setup

Follow these steps to set up Journeo locally for active editing and contribution (without Docker).

## 1. Prerequisites
- **Python 3.11+** installed (`python --version`)
- **[uv](https://github.com/astral-sh/uv)** installed. (Required by MCP to execute AviationStack commands via `uvx`).
  - Install via `curl -LsSf https://astral.sh/uv/install.sh | sh` (Linux/Mac)
  - Or `powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"` (Windows).
- A running **PostgreSQL** instance.

## 2. Environment Setup

Clone the repository and create a Python virtual environment:
```bash
git clone https://github.com/your-username/journeo.git
cd journeo
python -m venv venv

# Activate venv on Linux/Mac
source venv/bin/activate
# Activate venv on Windows
.\venv\Scripts\activate
```

Install standard dependencies:
```bash
pip install -r requirements.txt
```

## 3. Configuration Setup
Copy your environment variables to a `.env` file at the root of the project:
```bash
cp .env.example .env
```
Ensure you fill out:
- `GOOGLE_API_KEY`
- `TAVILY_API_KEY`
- `AVIATIONSTACK_API_KEY`
- `OPENWEATHER_API_KEY`
- `DATABASE_URL` (Point it to your local Postgres, e.g., `postgresql://postgres:password@localhost:5432/travel_db`)

## 4. Initialization (Database Setup)
TripMate AI relies on the `PostgresSaver()` checkpoint tool which will automatically create the schemas (`checkpoints`, `writes`, etc.) upon its first startup. No initial migration is necessary provided the database specified in the URL actually exists.

## 5. Running the Application
Spin up the FastAPI service using Uvicorn with hot-reload enabled:
```bash
uvicorn app:app --reload --host localhost --port 8000
```
Navigate to `http://localhost:8000/` to test your changes.
