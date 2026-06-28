# AGENTS.md — demo-frontend

## Commands

```bash
npm run dev       # vite dev server on :5173 (Docker overrides to :80)
npm run preview   # vite preview (serve built dist locally)
npm run build     # tsc -b && vite build (typecheck before bundle)
npm run lint      # eslint .
npm run test      # vitest run (setupFiles commented out — no tests yet)
```

## Stack

React 19 · TypeScript 6.0 · Vite 8 · Tailwind v4 · antd v6 · react-router-dom v7

## Architecture — 5 state management demos

```
src/
├── main.tsx              entry — Redux <Provider> → <BrowserRouter> → <App />
├── App.tsx               antd Layout (Sider + Content) + 5 routes
├── pages/                one route-level component per pattern
│   ├── CrossLayerDemo    React Context + Event Bus (peer-to-peer)
│   ├── ZustandDemo       Zustand stores (counter + todo)
│   ├── ReduxDemo         Redux Toolkit (createSlice + configureStore)
│   ├── ImmerDemo         useImmer hook (mutable-syntax immutable state)
│   └── ExternalStoreDemo useSyncExternalStore (external store + localStorage)
├── components/           Sidebar (antd Menu)
├── lib/                  state management implementations
│   ├── context.tsx       AppProvider + useAppContext
│   ├── event-bus.ts      pub/sub EventBus singleton
│   ├── zustand-store.ts  useCounterStore + useTodoStore
│   ├── redux-store.ts    counterSlice + todoSlice + configureStore
│   └── external-store.ts subscribe/getSnapshot pattern + localStorage sync
└── index.css             Tailwind v4 @import + @theme tokens
```

## Gotchas

- **TypeScript `verbatimModuleSyntax` + `erasableSyntaxOnly`** — `import type` required for type-only imports; no enum, namespace, or parameter properties
- **Tailwind v4** — `@import "tailwindcss"` in CSS, not PostCSS plugin. Theme in `@theme {}` block. `tailwind.config.js` exists only for IDE tooling
- **Path alias** — `@/` maps to `src/` (configured in tsconfig + vite.resolve.alias)
- **antd v6** — Used for Layout/Sider/Menu only; no antd components in pages
- **vitest `setupFiles`** is commented out in vitest.config.ts — uncomment before writing tests

## Docker

```bash
docker compose up         # dev with hot reload (mounts ./src)
docker compose down
```

- Dev: `Dockerfile.dev` (node:20-alpine, npm dev on :80)
- Prod: `Dockerfile` (multi-stage → nginx:alpine) — `VITE_API_BASE_URL` build arg via `.env.docker`
- Backend at `http://localhost:8000` / `ws://localhost:8000`

## Notice
- Every time start writing a new demo,make sure don't impact the finished demos
