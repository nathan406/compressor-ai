# Compressor AI — Next.js Backend

**AI Efficiency Operating System** · API Server v2.0

## Stack

- **Next.js 14** (App Router, API Routes only)
- **TypeScript**
- **better-sqlite3** — zero-dependency SQLite (persists jobs across restarts)
- **Anthropic SDK** — proxies Claude AI requests server-side (key never reaches the browser)

## Quick Start

```bash
cd backend
cp .env.example .env.local
# Add your Anthropic API key to .env.local (optional)

npm install
npm run dev       # starts on http://localhost:8000
```

## Environment Variables

| Variable            | Required | Default               | Description                          |
|---------------------|----------|-----------------------|--------------------------------------|
| `ANTHROPIC_API_KEY` | No       | —                     | Enables real Claude AI responses     |
| `CLAUDE_MODEL`      | No       | `claude-sonnet-4-6`   | Which Claude model to use            |
| `DB_PATH`           | No       | `./compressor.db`     | SQLite database file path            |

The app runs fully without an API key — Claude endpoints return the fallback
text the frontend supplies.

## API Endpoints

| Method | Path                | Description                          |
|--------|---------------------|--------------------------------------|
| POST   | `/api/auth/login`   | Authenticate (returns role)          |
| GET    | `/api/jobs`         | List all optimization jobs           |
| POST   | `/api/jobs`         | Create a new optimization job        |
| GET    | `/api/jobs/[id]`    | Fetch one job by ID                  |
| PATCH  | `/api/jobs/[id]`    | Update job status / progress / log   |
| DELETE | `/api/jobs/[id]`    | Delete a job                         |
| POST   | `/api/claude`       | Proxy prompt to Claude AI            |
| GET    | `/api/health`       | Service health check                 |

## Connecting the Frontend

The static `frontend/index.html` points to `http://localhost:8000` by default.
To change the backend URL, set `window.COMPRESSOR_API_BASE` before the app
script runs, or serve the HTML from the same origin as the Next.js server.

## Production Deployment

```bash
npm run build
npm start         # production server on port 8000
```

Deploy to Vercel, Railway, Fly.io, or any Node.js host. For Vercel, set the
environment variables in the project dashboard.
