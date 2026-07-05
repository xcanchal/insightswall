# ---- build: compile the app (vite build also prerenders / and /about) ----
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- deps: production-only node_modules ----
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---- runtime ----
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package.json package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Drizzle migrations run at container start (npm run db:migrate); drizzle-kit
# needs the config, the migration journal, and the schema sources.
COPY drizzle ./drizzle
COPY drizzle.config.ts tsconfig.json ./
COPY src/shared ./src/shared
COPY src/server/lib/db ./src/server/lib/db

EXPOSE 3000

CMD ["sh", "-c", "npm run db:migrate && npm run start"]
