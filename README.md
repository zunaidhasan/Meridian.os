# Meridian OS

A prototype business operations workspace for managing leads, sales, KYC reviews, and delivery work in one place. The app includes a dashboard, four workflow boards, reporting, activity history, and workspace settings.

> **Prototype notice:** Meridian OS is a demo, not a production-ready CRM or compliance system. Sign-in is client-side demo authentication, authorization is not enforced by the API, and the seeded records are sample data. Do not use real customer, financial, or identity information.

## Features

- **Dashboard:** pipeline totals, monthly wins, lead and KYC counts, items needing attention, and recent activity.
- **Lead Board:** track lead stage, estimated value, source, and owner.
- **Sales Board:** manage deal stages, values, owners, and target close dates.
- **KYC Board:** track review status, document counts, risk, and reviewer notes. This prototype does not store or process document files.
- **Operations:** assign tasks, set due dates and priorities, and follow work through its status stages.
- **Reports and activity:** review business metrics and the sample activity log.
- **Workspace settings:** view and update the demo workspace configuration.
- **Responsive interface:** use the boards on desktop or touch devices.

## Stack

- Next.js 16 with the App Router and TypeScript
- React 19 and Tailwind CSS 4
- PostgreSQL with Drizzle ORM and Drizzle Kit

## Requirements

- Node.js 20 or newer
- npm
- A PostgreSQL database

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file and set its database URL:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and set `DATABASE_URL` to a PostgreSQL connection string. Create the database first if it does not already exist.

3. Create or update the database tables from the Drizzle schema:

   ```bash
   npm run db:push
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

The dashboard seeds sample records when the database is empty. The demo login accepts a valid email and a password of at least four characters; the **Use the demo account** button fills in the demo credentials for you.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local Next.js development server. |
| `npm run build` | Create a production build. A database connection is not required during build. |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run ESLint. |
| `npm run typecheck` | Run the TypeScript compiler without emitting files. |
| `npm run db:push` | Apply the Drizzle schema to the database in `DATABASE_URL`. |
| `npm run db:studio` | Open Drizzle Studio for the configured database. |

## Deployment

1. Provision a PostgreSQL database and set `DATABASE_URL` in the deployment platform's environment settings.
2. Apply the schema to that database with `npm run db:push` using the same `DATABASE_URL`.
3. Deploy the application with `npm run build` (or the platform's Next.js build integration).

Keep database credentials out of source control. The checked-in `.env.example` is only a local template; `.env.local` and other `.env*` files are ignored.

## Project layout

```text
src/
  app/
    (app)/       Authenticated workspace pages
    api/         Route handlers for dashboard and board data
    login/       Prototype sign-in
  components/    Shared UI, Kanban board, and toast notifications
  db/            Drizzle client and PostgreSQL schema
  lib/           API helpers, seed data, and shared types
```
