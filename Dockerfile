FROM node:22-bookworm-slim AS frontend-builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html components.json tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts postcss.config.js tailwind.config.ts eslint.config.js ./
COPY public ./public
COPY src ./src

ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

FROM dunglas/frankenphp:1-php8.2-bookworm AS runtime

WORKDIR /app

RUN install-php-extensions \
    bcmath \
    curl \
    gd \
    intl \
    mbstring \
    mysqli \
    opcache \
    pdo_mysql \
    zip

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=frontend-builder /app/dist /app/dist
COPY api /app/api
COPY mysql /app/mysql
COPY scripts /app/scripts
COPY uploads /app/uploads

RUN mkdir -p /app/api/logs /app/api/cache /app/runtime

EXPOSE 80

CMD ["frankenphp", "run", "--config", "/etc/caddy/Caddyfile"]
