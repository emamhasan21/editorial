# হ য ব র ল

হ য ব র ল is a fast, self-hosted Bangla publishing application with a visual block editor and a documentation-inspired reading experience. It runs as one Next.js application with MariaDB/MySQL and local media storage—no WordPress and no hosted backend service.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6) ![MariaDB](https://img.shields.io/badge/MariaDB-self--hosted-003545) ![License](https://img.shields.io/badge/license-MIT-6d5dfc)

## What is included

- Persistent shadcn-docs-style header, left navigation, reading column, and table of contents
- Responsive mobile navigation and command search (`Ctrl/Cmd + K`)
- Light/dark themes, animated canvas background, word reveals, and route view transitions
- Reduced-motion support and keyboard-visible focus states
- Tiptap/ProseMirror block editor with headings, lists, quotes, links, images, tables, highlighting, alignment, section breaks, verse, footnotes, author notes, spoilers, code, undo/redo, and HTML preview
- Local autosave plus database publishing and immutable revisions
- Separate account roles (`owner`, `admin`, `managing_editor`, `editor`, `writer`, `contributor`, `reader`) and literary author identities
- Classic authors without accounts, current authors linked to accounts, and ordered multi-author/translator/editor credits
- Standalone releases for stories, poems, essays, articles, reviews, interviews, and notes
- Series, works, editions/books, independently stored chapters, chapter revisions, and reading-progress schema
- Email/password accounts and database sessions through self-hosted Better Auth
- Posts, co-authors, media, categories, tags, comments, reactions, bookmarks, reusable patterns, and settings
- Sanitized server-side HTML rendering, derived plain text, and generated table of contents
- Sharp image validation/optimization and local filesystem storage
- Health, post, media, comment, and reaction API routes
- Drizzle migrations, deterministic seed data, unit tests, browser tests, and standalone output for a small VPS

## Stack

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Motion, Tiptap 3, MariaDB/MySQL, Drizzle ORM, Better Auth, Sharp, Vitest, and Playwright.

## Quick start

Requirements: Node.js 20.9 or newer, npm, and MariaDB/MySQL 10.4 or newer.

1. Install packages.

   ```bash
   npm install
   ```

2. Create your local environment file.

   macOS/Linux:

   ```bash
   cp .env.example .env.local
   ```

   Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env.local
   ```

3. Create an isolated database and user. Run these statements as a MariaDB/MySQL administrator, replacing the password in both SQL and `.env.local`.

   ```sql
   CREATE DATABASE editorial CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'editorial'@'localhost' IDENTIFIED BY 'choose-a-strong-password';
   GRANT ALL PRIVILEGES ON editorial.* TO 'editorial'@'localhost';
   FLUSH PRIVILEGES;
   ```

4. Apply the schema and add development content.

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. Start the app.

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000). The seeded development account is `owner@editorial.local` with password `ChangeMe-Editorial-2026`; change it immediately outside local development.

The public library is at `/books`, `/series`, `/writers`, and `/releases`. The writer studio is at `/studio`; release and chapter editors are at `/studio/new` and `/studio/chapters/new`. Sign-in is at `/login`, and health status is at `/api/health`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production and standalone build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint checks |
| `npm run typecheck` | Generate route types and run TypeScript |
| `npm test` | Unit tests |
| `npm run test:e2e` | Desktop and mobile browser tests |
| `npm run db:generate` | Generate a migration after schema changes |
| `npm run db:migrate` | Apply committed migrations |
| `npm run db:seed` | Add the owner, author profiles, series, book, chapter, settings, and first release |
| `npm run db:studio` | Open Drizzle Studio |

Install Playwright’s isolated test browser once before the first end-to-end run: `npx playwright install chromium`.

## Content architecture

The editors save portable Tiptap JSON as the canonical document. On publish, the server validates the payload, generates semantic HTML, sanitizes it, extracts plain text and headings, and creates a permanent revision. Public pages render the sanitized HTML, while the original JSON remains available for future editing and migrations.

Books never store one giant body. Every chapter is an indexed document with its own URL, status, rendered output, table of contents, word count, and revision history. This keeps large works responsive and keeps database requests small enough for the target 1 GB RAM VPS.

Authentication and authorization checks live at API/data boundaries. UI visibility is never treated as the security boundary.

## Deployment

See [docs/deployment.md](docs/deployment.md) for an IP-only VPS setup designed for 1 vCPU, 1 GB RAM, and an existing WordPress/MariaDB server. হ য ব র ল listens privately on port 3000 and Nginx exposes it through the server IP on port 80 while the WordPress domain remains on its own host.

## Repository notes

- `.env.local`, uploaded media, build output, database files, and test artifacts are ignored.
- Commit `.env.example` but never a real secret.
- The application does not require Redis. It can be added later for queues or distributed caching.
- Before a public launch, put the app behind HTTPS and replace every development credential.

## License

MIT © 2026 Emam Hasan
