FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/types/package.json packages/types/
COPY apps/web/package.json apps/web/
RUN npm ci --workspace=@app/types --workspace=@app/web --include-workspace-root=false
COPY packages/types packages/types
COPY apps/web apps/web
ARG VITE_API_URL
ARG VITE_BETTER_AUTH_URL
RUN npm run build --workspace=@app/types && npm run build --workspace=@app/web

FROM nginx:1.29-alpine
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist/client /usr/share/nginx/html
