# Yarn Tracker

A React and Fastify application for managing yarn products, yarn stash,
patterns, and finished projects in the existing PostgreSQL database.

## Prerequisites

- Node.js 22 or later
- PostgreSQL 14 or later
- A database connection string in `.env`

## Database setup

Create a PostgreSQL database, then load the provided schema and optional sample
data. Replace the placeholder values with your own database name and user.

```bash
createdb yarn_tracker
psql -d yarn_tracker -f yarn_tracker_dump_postgres.sql
psql -d yarn_tracker -f data_dump.sql
```

Create `.env` in the project root:

```dotenv
DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/yarn_tracker
```

## Install and run in development

```bash
npm install
```

Start the API in one terminal:

```bash
npm run dev
```

Start the Vite frontend in a second terminal:

```bash
npm run dev:client
```

Open the URL Vite prints (normally `http://localhost:5173`). The Vite server
proxies `/api` requests to Fastify on port `3000`.

## Production-style run

Build the API and client, then have Fastify serve the built client:

```bash
npm run build
npm start
```

Open `http://localhost:3000`.

## Verification commands

```bash
npm run build
npm test
npm run lint
```

The app exposes `GET /health` and API endpoints under `/api`. Weight and fiber
lookups are GET-only; brands can be created only through `POST /api/brands` as
part of the yarn-product workflow.
