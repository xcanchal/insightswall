# Insightswall

Insightswall is a feedback board and public roadmap platform for small software teams. It lets product teams collect suggestions, prioritize them with votes, and communicate progress through a public roadmap.

## Repository structure

This project is organized as a monorepo:

```text
.
├── apps
│   ├── api        # Hono + Node.js back-end
│   └── web        # React + Vite front-end
├── packages
│   └── types      # Shared constants and types
├── .github
│   └── workflows  # CI workflow
└── .husky         # Local Git hooks
```

## Tech stack

- Front-end: React, Vite, TypeScript
- Back-end: Node.js, Hono, Better Auth
- Database: PostgreSQL, Drizzle ORM
- Styling: Tailwind CSS, shadcn/ui
- Testing: Vitest, Playwright
- Deployment: Render

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

The API expects these variables:

- `DATABASE_URL`
- `BETTER_AUTH_URL`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `FRONTEND_URL`

The web app expects:

- `VITE_API_URL`
- `VITE_BETTER_AUTH_URL`

### Run locally

Run both applications:

```bash
npm run dev
```

Or run each app separately:

```bash
npm run dev:api
npm run dev:web
```

## Main scripts

```bash
npm run build
npm run lint
npm run format:check
npm run test
npm run typecheck
```

## API documentation

The API exposes OpenAPI-based documentation through Hono:

- Swagger UI: `/docs`
- OpenAPI spec: `/openapi.json`

These endpoints are useful both for manual inspection and for keeping the API contract documented alongside the implementation.

## Testing

- API integration tests: `apps/api/test`
- Web end-to-end tests: `apps/web/test/e2e`

Run all tests:

```bash
npm run test
```

## Quality checks

- Husky runs local pre-commit checks
- GitHub Actions runs CI on pull requests against `main`
- Render deploys the production services automatically from `main`
