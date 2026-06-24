# AGENTS.md — demo-frontend

## Commands

```bash
npm run dev       # start dev server on :80 (non-standard port)
npm run build     # tsc -b && vite build (typecheck before bundle)
npm run lint      # eslint .
npm run preview   # vite preview
```

## Tech stack

React 19 · TypeScript 6.0 · Vite 8 · Tailwind CSS v4

## Architecture

- `src/main.tsx` — entry, renders `<App />`
- `src/App.tsx` — root component
- `src/index.css` — Tailwind v4 via `@import "tailwindcss"`; global resets

## Gotchas

- **Dev server binds `0.0.0.0:80`** — requires root or `sudo setcap 'cap_net_bind_service=+ep'` on Linux; Docker avoids this
- **TypeScript `verbatimModuleSyntax` + `erasableSyntaxOnly`** — `import type` is required for type-only imports; no enum/namespace
- **Tailwind v4** — uses `@import "tailwindcss"` in CSS (plugin approach), not the old v3 PostCSS plugin. `tailwind.config.js` still exists for IDE tooling but theme tokens live in `@theme {}` block

## Conventions

- **"启动服务"** → 执行 `docker compose up`

## Docker

```bash
docker compose up         # dev with hot reload (mounts ./src)
docker compose down
```

Build target: `Dockerfile.dev` by default. Production uses `Dockerfile` (multi-stage → nginx:alpine).

- `.dockerignore` excludes `node_modules`, `dist`, `.git`
- `.env.docker` sets `VITE_API_BASE_URL` for container builds

## Notice
- 后端HTTP服务Host地址: http://localhost:8000
- 后端WebSocket服务Host地址: ws://localhost:8000