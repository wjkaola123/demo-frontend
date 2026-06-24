# AGENTS.md — demo-frontend

## Commands

```bash
npm run dev       # vite dev server on :5173 (Docker overrides to :80)
npm run build     # tsc -b && vite build (typecheck before bundle)
npm run lint      # eslint .
npm run test      # vitest run (no tests written yet)
```

## Stack

React 19 · TypeScript 6.0 · Vite 8 · Tailwind v4 · antd v6 · react-router-dom v7

## Architecture

```
src/
├── main.tsx              entry — BrowserRouter → <App />
├── App.tsx               antd Layout (Sider + Content) + Routes
├── pages/                route-level page components (CrossLayerDemo)
├── components/           reusable components (Sidebar)
├── lib/                  pure logic (context.tsx, event-bus.ts)
└── index.css             Tailwind v4 @import + @theme tokens
```

Cross-layer demo uses two communication patterns:
- `src/lib/context.tsx` — React Context (AppProvider) for top-down shared state
- `src/lib/event-bus.ts` — pub/sub EventBus for decoupled peer-to-peer messaging

## Gotchas

- **TypeScript `verbatimModuleSyntax` + `erasableSyntaxOnly`** — `import type` required for type-only imports; no enum, namespace, or parameter properties
- **Tailwind v4** — `@import "tailwindcss"` in CSS, not PostCSS plugin. Theme in `@theme {}` block. `tailwind.config.js` exists only for IDE tooling
- **Path alias** — `@/` maps to `src/` (configured in tsconfig + vite.resolve.alias)
- **antd v6** — Used for Layout/Sider/Menu only; no antd components in pages

## Docker

```bash
docker compose up         # dev with hot reload (mounts ./src)
docker compose down
```

- Default: `Dockerfile.dev` (node:20-alpine, npm dev on :80)
- Production: `Dockerfile` (multi-stage → nginx:alpine)
- `VITE_API_BASE_URL` set via `.env.docker` for container builds
- Backend at `http://localhost:8000` / `ws://localhost:8000`
