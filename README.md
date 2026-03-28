# Alief Locals

This project supports Docker-based deployment with:

- a Vite-built frontend
- a PHP API under `/api` served by FrankenPHP/Caddy
- MariaDB on an external Docker network

## Local frontend

Install dependencies and run the frontend:

```bash
npm install
npm run dev
```

The Vite app runs on `http://localhost:8080`.

## Local API

The repo includes a PHP API in [api/index.php](/Users/marvin/Sites/upwork/alieflocals/api/index.php) and a migration runner in [migrate.php](/Users/marvin/Sites/upwork/alieflocals/scripts/migrate.php).

1. Copy [api/.env.example.php](/Users/marvin/Sites/upwork/alieflocals/api/.env.example.php) to `api/.env.php`.
2. Create the MySQL database first.
3. Adjust the MySQL credentials in `api/.env.php`.
4. Run the migration:

```bash
php scripts/migrate.php
```

5. Serve the API with PHP however you prefer locally. The frontend build for production uses `/api` as the API base.

## Docker deployment

1. Copy [.env.docker.example](/Users/marvin/Sites/upwork/alieflocals/.env.docker.example) to `.env.docker`.
2. Update `APP_URL`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`, and `JWT_SECRET`.
3. Ensure the `bamlead-vps-db` MariaDB stack is running on the VPS.
4. Confirm the external Docker network from that stack exists. On your VPS the app should use `mysql_bamlead-network`, and the database host is `bamlead-mariadb`.
5. For first-time setup, either create the target MariaDB database/user yourself or set `MYSQL_ADMIN_USER` and `MYSQL_ADMIN_PASSWORD` in `.env.docker` so the migration can create them.
6. Run the migration inside the app container:

```bash
docker compose --env-file .env.docker run --rm --no-deps app php /app/scripts/migrate.php
```

7. Start the app:

```bash
docker compose --env-file .env.docker up -d --build
```

By default the app binds to host port `8080`, which avoids conflicting with the Bamlead app if that project already uses `80` and `443` on the same VPS.

## GitHub deployment

The workflow at [deploy.yml](/Users/marvin/Sites/upwork/alieflocals/.github/workflows/deploy.yml) now syncs this repository to:

`/home/devmarvsftp/domains/alieflocals.com/prod`

It then runs `docker compose` there.

On every push to `main`, it:

1. installs dependencies, runs tests, and verifies the frontend build
2. syncs the repository to the VPS app directory, excluding local env files and runtime data
3. checks that `.env.docker` exists on the server
4. checks that the MariaDB Docker network exists
5. builds the app image, runs `php /app/scripts/migrate.php` against MariaDB, and restarts the Docker stack

Required secrets:

- `DEPLOY_SSH_HOST`
- `DEPLOY_SSH_PORT`
- `DEPLOY_SSH_USER`
- `DEPLOY_SSH_PRIVATE_KEY`

Required server-side file:

- `.env.docker` in the remote app directory

Optional first-run env vars in `.env.docker`:

- `MYSQL_ADMIN_USER`
- `MYSQL_ADMIN_PASSWORD`
