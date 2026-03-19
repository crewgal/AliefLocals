# Alief Locals

This app now uses a local Node/Express API backed by MySQL instead of Supabase.

## Local setup

1. Copy `.env.example` to `.env` and adjust the MySQL credentials if needed.
2. Create the database schema:

```bash
mysql -u root -p < mysql/schema.sql
```

3. Install dependencies:

```bash
npm install
```

4. Start the API server in one terminal:

```bash
npm run server
```

5. Start the frontend in another terminal:

```bash
npm run dev
```

The frontend runs on `http://localhost:8080` by default and the API runs on `http://localhost:3001`.

## GitHub deployment

The repo includes [deploy.yml](/Users/marvin/Sites/upwork/alieflocals/.github/workflows/deploy.yml), which deploys to:

`/home/u497238762/domains/alieflocals.com/public_html`

On every push to `main`, the workflow:

1. Installs dependencies, runs tests, and builds the frontend with `VITE_API_URL=/api`.
2. Uploads `dist/`, `server/`, `mysql/`, and the runtime `package*.json` files to the target server over SSH.
3. Writes a production `.env` file on the server from GitHub Secrets.
4. Runs `npm ci --omit=dev` on the server.
5. Runs the MySQL migration file `mysql/schema.sql`.
6. Optionally runs a restart command if you provide one in secrets.

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

Examples for `DEPLOY_RESTART_COMMAND` depend on your host setup. If your host uses Passenger, it is often something like `mkdir -p tmp && touch tmp/restart.txt`. If you use `pm2`, it could be `pm2 restart alieflocals`.
