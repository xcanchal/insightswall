FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/types/package.json packages/types/
COPY apps/api/package.json apps/api/
RUN npm ci --workspace=@app/types --workspace=@app/api --include-workspace-root=false
COPY packages/types packages/types
COPY apps/api apps/api
RUN npm run build --workspace=@app/types && npm run build --workspace=@app/api

FROM node:24-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/types/package.json packages/types/
COPY apps/api/package.json apps/api/
RUN npm ci --omit=dev --workspace=@app/types --workspace=@app/api --include-workspace-root=false && npm cache clean --force
COPY --from=build /app/packages/types/dist packages/types/dist
COPY --from=build /app/apps/api/dist apps/api/dist
USER node
WORKDIR /app/apps/api
EXPOSE 3000
CMD ["node", "dist/src/index.js"]
