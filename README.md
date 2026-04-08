# Uzo Platform OS

Africa’s developer-first routing, ETA, and location intelligence infrastructure.

## Project Structure
- `apps/dashboard_web`: Next.js admin & billing dashboard
- `apps/docs_portal`: Nextra API documentation
- `services/atlas_core`: Atlas geospatial engine root
- `services/api_gateway`: Fastify ingress for SDK requests
- `services/telemetry_processor`: Stream ingestion for GPS logs
- `database/`: Prisma ORM schema and migrations
- `sdk/`: Wrapper packages for iOS, Android, and Web
- `infrastructure/`: K8s manifests & Docker deployments

## Supabase Connection Setup
1. Copy `.env.example` to `.env` in the root folder.
2. Go to your **Supabase Project Settings -> Database**.
3. Copy your Transaction connection string (Port 6543) to `DATABASE_URL`. Ensure `?pgbouncer=true` is appended to the connection string.
4. Copy your Session connection string (Port 5432) to `DIRECT_URL`.
5. Run the migrations:

```bash
cd database
npm install
npx prisma generate
npx prisma db push
```

## Running Locally
In the root directory, install dependencies and use Turborepo to spin up the web and API gateway applications automatically.
```bash
npm install
npx turbo run dev
```
