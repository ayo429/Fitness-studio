Stride Fitness

A fitness studio website with a real backend: programs and plans come from a Postgres database, members can sign up and sign in, choose a plan, and see it on their own dashboard.

Live site: https://fitness-studio-delta-self.vercel.app
API: https://fitness-studio-9ins.onrender.com

The free hosting sleeps when idle, so the first request after a quiet spell can take up to a minute.

Tech stack
Client: React, Vite, Tailwind CSS v4, React Router
Server: Node.js, Express 5 (ES modules)
Database: Postgres on Neon
Login: Better Auth (email and password, sessions stored in Postgres)
Hosting: Vercel (client), Render (server)
Folder structure
stride-fitness/
  client/                 React app
    src/components/       Navbar, Hero, Programs, Plans, Join, Footer, AuthModal ...
    src/pages/            Dashboard
    src/context/          shared sign-in pop-up
    src/hooks/            useFetch
    src/lib/              auth client
    vercel.json           forwards /api to Render, serves the app for every page
  server/                 Express API
    src/index.js          app setup and routes
    src/auth.js           Better Auth setup
    src/db.js             Postgres connection pool
    src/routes/           programs, plans, membership
    src/migrate.js        applies sql/schema.sql
    src/seed.js           fills programs and plans (safe to re-run)
    sql/schema.sql        the database tables

The repository also contains the original HTML/CSS version of the site.

How it fits together

The browser only talks to the Vercel address. Vercel forwards every /api/... request to the Render server, which talks to Neon. Because the browser sees a single address, the login cookie stays first-party. In development, Vite's proxy does the same job and forwards /api to localhost:4000.

Database
Table	Purpose
programs	Training programs shown on the home page
plans	Membership plans and monthly prices
plan_features	The bullet points listed under each plan
leads	Email addresses collected by the Join form
memberships	The plan each member is on (one row per member)
user, account, session, verification	Created by Better Auth for login

memberships.user_id points at Better Auth's user table, so the auth tables must exist before sql/schema.sql is applied.

API
Method and path	What it does
GET /api/health	Server status check
GET /api/programs	List programs
GET /api/plans	List plans with their features
/api/auth/*	Sign up, sign in, sign out, session (Better Auth)
GET /api/me	The signed-in user, or null
GET /api/membership	The signed-in member's plan (needs login)
PUT /api/membership	Choose or change plan, body { "planId": 2 } (needs login)
Run it locally

Create server/.env (it is git-ignored; server/.env.example lists the names):

DATABASE_URL=         your Neon connection string
CLIENT_URL=http://localhost:5173
BETTER_AUTH_URL=http://localhost:5173
BETTER_AUTH_SECRET=   a long random string

Then, in two terminals:

cd stride-fitness/server
npm install
npx auth@latest migrate --config src/auth.js   # login tables (first time only)
npm run db:migrate                             # app tables
npm run db:seed                                # programs and plans
npm run dev                                    # http://localhost:4000

cd stride-fitness/client
npm install
npm run dev                                    # http://localhost:5173

Other server scripts: npm run db:test checks the database connection.

Deploy

Render (server): root directory stride-fitness/server, build command npm install, start command npm start. Environment variables: DATABASE_URL, CLIENT_URL, BETTER_AUTH_URL, BETTER_AUTH_SECRET. Set CLIENT_URL and BETTER_AUTH_URL to the Vercel address with no trailing slash.

Vercel (client): root directory stride-fitness/client. vercel.json forwards /api to the Render URL.

Secrets live only in .env locally and in Render's environment settings. They are never committed.
