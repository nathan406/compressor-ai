# Compressor AI — Next.js Backend v3.0

**The AI Efficiency Operating System** — Serverless API deployed on Netlify.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, serverless functions) |
| Language | TypeScript |
| Database | PostgreSQL via Prisma ORM (Neon free tier) |
| Auth | JWT + bcrypt |
| AI | Anthropic Claude (server-side proxy) |
| Storage | Cloudflare R2 (optional — model file uploads) |
| Hosting | Netlify (free tier) |

---

## Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local — add DATABASE_URL from neon.tech and JWT_SECRET

# 3. Push schema to database and create demo accounts
npm run db:push
npm run db:seed

# 4. Start dev server
npm run dev
# → http://localhost:8000
```

---

## Deploy to Netlify

1. Push this folder to a GitHub repo
2. Connect repo to Netlify
3. Add environment variables in **Netlify Dashboard → Site → Environment Variables**:

```
DATABASE_URL          your Neon connection string
JWT_SECRET            a long random string
ANTHROPIC_API_KEY     sk-ant-... (optional — enables real Claude responses)
CLAUDE_MODEL          claude-sonnet-4-6
REGISTER_SECRET       any secret string (used to create admin accounts)
```

4. Netlify auto-detects Next.js and runs `npm run build` on every deploy.
5. After first deploy, run `npm run db:seed` once locally against the production DB to create the demo accounts.

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/login` | — | Authenticate, returns JWT |
| POST | `/api/auth/register` | — | Create account |
| GET | `/api/auth/me` | ✓ | Current user profile |
| GET | `/api/jobs` | ✓ | List all jobs |
| POST | `/api/jobs` | ✓ | Create optimization job |
| GET | `/api/jobs/[id]` | ✓ | Fetch one job |
| PATCH | `/api/jobs/[id]` | ✓ | Update job progress/status |
| DELETE | `/api/jobs/[id]` | ✓ | Delete a job |
| GET | `/api/jobs/[id]/stream` | ✓ | SSE real-time log stream |
| POST | `/api/jobs/upload` | ✓ | Presigned R2 upload URL |
| POST | `/api/optimize/prompt` | ✓ | Layer 2 — Prompt optimization |
| POST | `/api/optimize/route` | ✓ | Layer 3 — Smart routing |
| POST | `/api/optimize/context` | ✓ | Layer 4 — Context compression |
| GET | `/api/optimize/score` | ✓ | AI Efficiency Score™ |
| POST | `/api/optimize/scan` | ✓ | Full infrastructure scan |
| GET | `/api/analytics` | ✓ | Aggregated savings data |
| GET | `/api/analytics/savings` | ✓ | Savings by day (30-day) |
| GET | `/api/analytics/models` | ✓ | Per-model cost breakdown |
| POST | `/api/claude` | — | Claude AI proxy |
| GET | `/api/health` | — | Health check |

All protected routes require: `Authorization: Bearer <token>`

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@compressor.ai | admin123 |
| Enterprise Demo | demo@enterprise.ai | demo123 |

---

## What Each Layer Does

| Layer | Route | What runs |
|-------|-------|-----------|
| Layer 2 | `/api/optimize/prompt` | Claude Haiku rewrites prompts shorter |
| Layer 3 | `/api/optimize/route` | Complexity scoring routes to cheaper models |
| Layer 4 | `/api/optimize/context` | Claude Haiku compresses conversation history |
| Layer 1 | Job worker (future) | Model quantization/pruning/distillation |
| Layer 5 | Infrastructure (future) | GPU rebalancing, load balancing |

Layers 2, 3, 4 are fully functional serverless today.
Layers 1 and 5 require a GPU server — jobs are queued and tracked in the database.

---

## The 5-Layer Platform

```
AI Model → User Request → GPU → Response
   L1          L2    L3    L4       L5
```

- **L1 Model Optimization** — Quantization, pruning, distillation (GPU required)
- **L2 Prompt Optimization** — Remove redundant tokens before sending to any model
- **L3 Smart Routing** — Route by complexity to the cheapest adequate model
- **L4 Context Compression** — Summarize conversation history to reduce context size
- **L5 Inference Network** — GPU fleet rebalancing and load distribution (future)
