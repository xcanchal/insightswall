# Insightswall

Insightswall is a feedback board and public roadmap platform for small software teams. It lets product teams collect suggestions, prioritize them with votes, and communicate progress through a public roadmap.

## Repository structure

A single full-stack TanStack Start application. The Hono API is mounted inside the Start server as server routes, so one process serves both the web app and the API.

```text
.
├── src
│   ├── routes         # File-based routes (pages + /api server routes)
│   ├── components     # React components
│   ├── hooks          # React hooks
│   ├── lib            # Client-side utilities (api client, auth client)
│   ├── server         # Hono API: modules, db, auth, email
│   └── shared         # Constants and types shared by client and server
├── public             # Static assets (widget.js, og image, ...)
├── drizzle            # Database migrations
├── test
│   ├── integration    # API integration tests (Vitest)
│   └── e2e            # End-to-end tests (Playwright)
├── .github/workflows  # CI workflow
└── .husky             # Local Git hooks
```

## Tech stack

- Framework: TanStack Start (React, Vite, SSR + prerendered public pages)
- API: Hono, Better Auth
- Database: PostgreSQL, Drizzle ORM
- Styling: Tailwind CSS, shadcn/ui
- Testing: Vitest, Playwright
- Deployment: Docker (Coolify)

## Getting started

### Prerequisites

- Node.js 24+
- npm
- PostgreSQL database

### Install dependencies

```bash
npm ci
```

### Environment variables

Copy `.env.example` to `.env` and fill in:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `FRONTEND_URL`

The web client needs no environment variables: it talks to the API on the same origin.

### Run locally

```bash
npm run dev
```

One dev server (Vite) serves the web app and the API together.

## Main scripts

```bash
npm run build        # Production build (also prerenders / and /about)
npm run start        # Serve the production build
npm run lint
npm run format:check
npm run test         # Unit + e2e
npm run typecheck
npm run db:generate  # Generate a migration from schema changes
npm run db:migrate   # Apply migrations
```

## Deployment

The Dockerfile builds a self-contained image that applies database migrations on boot and serves the app on port 3000:

```bash
docker build -t insightswall .
docker run -p 3000:3000 --env-file .env insightswall
```

On Coolify, point a Dockerfile-based service at this repository and configure the environment variables above.

## API documentation

The API exposes OpenAPI-based documentation through Hono:

- Swagger UI: `/docs`
- OpenAPI spec: `/openapi.json`

These endpoints are useful both for manual inspection and for keeping the API contract documented alongside the implementation.

## Testing

- API integration tests: `test/integration`
- Web end-to-end tests: `test/e2e`

Run all tests:

```bash
npm run test
```

## Quality checks

- Husky runs local pre-commit checks
- GitHub Actions runs CI on pull requests against `main`
