# Alief Locals

This project now supports shared-hosting deployment with:

- a Vite-built frontend
- a PHP API under `/api`
- MySQL

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
2. Adjust the MySQL credentials in `api/.env.php`.
3. Run the migration:

```bash
php scripts/migrate.php
```

4. Serve the API with PHP however you prefer locally. The frontend build for production uses `/api` as the API base.

## GitHub deployment

The workflow at [deploy.yml](/Users/marvin/Sites/upwork/alieflocals/.github/workflows/deploy.yml) deploys to:

`/home/u497238762/domains/alieflocals.com/public_html`

On every push to `main`, it:

1. installs dependencies, runs tests, and builds the frontend with `VITE_API_URL=/api`
2. uploads the built frontend to `public_html`
3. uploads `api/`, `mysql/`, `scripts/`, and Apache `.htaccess` files
4. writes `api/.env.php` on the server from GitHub Secrets
5. runs `php scripts/migrate.php` on the server so MySQL migrations apply automatically

Required secrets:

- `DEPLOY_SSH_HOST`
- `DEPLOY_SSH_PORT`
- `DEPLOY_SSH_USER`
- `DEPLOY_SSH_PRIVATE_KEY`
- `DEPLOY_SSH_KNOWN_HOSTS`
- `DEPLOY_DB_HOST`
- `DEPLOY_DB_PORT`
- `DEPLOY_DB_NAME`
- `DEPLOY_DB_USER`
- `DEPLOY_DB_PASSWORD`
- `APP_JWT_SECRET`

Optional secret:

- `DEPLOY_RESTART_COMMAND`

Most PHP shared hosting setups do not need `DEPLOY_RESTART_COMMAND`. If your host uses a restart trigger, you can add it there.
