# 🚀 CodeArena

**Real-time competitive programming metaverse** — Discord-like guilds, live coding battles, WebRTC voice, AI assistance, and gamification.

## Quick Start

```bash
# 1. Install dependencies
npm install
cd apps/api && npm install
cd ../web && npm install
cd ../..

# 2. Start databases (requires Docker)
docker-compose up -d

# 3. Copy environment variables
cp .env.example apps/api/.env

# 4. Start development servers
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | Next.js 14, React 18, TypeScript, TailwindCSS, Monaco Editor, Socket.IO Client |
| Backend | Node.js 20+, Express, TypeScript, Socket.IO, Mongoose |
| Database | MongoDB (primary), Redis (cache/realtime), PostgreSQL (analytics) |
| Infra | Docker, Docker Compose, Kubernetes |

## Project Structure

```
codearena/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Express backend
├── docker-compose.yml
└── README.md
```
