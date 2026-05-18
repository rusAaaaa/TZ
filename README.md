# Quiz Builder

Full-stack quiz builder for creating, listing, viewing, and deleting quizzes.

## Stack

- Backend: Node.js, Express, TypeScript, Prisma
- Database: local SQLite file
- Frontend: Next.js 14, React 18, TypeScript
- Forms: React Hook Form + Zod
- Styling: Tailwind CSS

## Project Structure

```text
quiz-builder/
  backend/
    prisma/
      schema.prisma
      setup.ts
      seed.ts
    src/
      app.ts
      index.ts
      routes/
      services/
      validators/
  frontend/
    src/
      components/
      pages/
      services/
      styles/
      types/
```

## Quick Start

Install dependencies if they are not already installed:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Create the local database and Prisma client:

```bash
cd backend
npm run db:migrate
```

Add sample quizzes:

```bash
npm run db:seed
```

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open the app at `http://localhost:3000`.

On Windows, if the global `npm` command is not available, use the included scripts from
the project root:

```bat
setup-db.cmd
start-backend.cmd
start-frontend.cmd
```

Run `setup-db.cmd` before starting the backend. On Windows, Prisma cannot regenerate
its client while the backend is already using it.

## Environment

Backend `.env`:

```env
DATABASE_URL="file:./dev.db"
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

Frontend `.env.local` is optional. If omitted, the frontend uses `http://localhost:4000`.

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## API

Base URL: `http://localhost:4000`

- `GET /health` - health check
- `GET /quizzes` - list quizzes
- `GET /quizzes/:id` - get quiz details
- `POST /quizzes` - create quiz
- `DELETE /quizzes/:id` - delete quiz

Responses use this envelope:

```json
{ "success": true, "data": {} }
```

Errors:

```json
{ "success": false, "error": "message" }
```

## Scripts

Backend:

- `npm run dev` - start API in development
- `npm run build` - compile TypeScript
- `npm start` - run compiled API
- `npm run db:migrate` - generate Prisma Client and create SQLite tables
- `npm run db:seed` - add sample data

Frontend:

- `npm run dev` - start Next.js
- `npm run build` - production build
- `npm start` - serve production build
