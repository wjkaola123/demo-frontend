# AGENTS.md — demo-frontend

## Commands

```bash
npm run dev        # vite dev server on :5173 (Docker overrides to :80)
npm run build      # tsc -b && vite build (typecheck before bundle)
npm run preview    # vite preview (serve built dist locally)
npm run lint       # eslint .
npm run test       # vitest run
npm run test:watch # vitest watch mode
```

## Stack

React 19 · TypeScript 6.0 · Vite 8 · Tailwind v4 · antd v6 · react-router-dom v7

## Architecture — 11 demos, 3 groups

Sidebar groups demos into three categories:

**全局状态管理库:**
- `ZustandDemo` — Zustand stores (counter + todo)
- `ReduxDemo` — Redux Toolkit (createSlice + configureStore)

**React 原生 Hooks:**
- `ImmerDemo` — useImmer hook (mutable-syntax immutable state)
- `ExternalStoreDemo` — useSyncExternalStore (external store + localStorage)
- `TransitionDemo` — useTransition
- `DeferredValueDemo` — useDeferredValue
- `UseEffectDemo` — useEffect
- `UseLayoutEffectDemo` — useLayoutEffect
- `UseRefDemo` — useRef
- `UseImperativeHandleDemo` — useImperativeHandle

**跨层通信:**
- `CrossLayerDemo` — React Context + EventBus (pub/sub)

```
src/
├── main.tsx              entry — Redux <Provider> → <BrowserRouter> → <App />
├── App.tsx               antd Layout + 11 <Route> entries
├── components/
│   └── Sidebar.tsx       antd Menu with 3 grouped categories
├── pages/                one route-level component per demo
├── lib/                  state management implementations
│   ├── context.tsx       AppProvider + useAppContext
│   ├── event-bus.ts      pub/sub EventBus singleton
│   ├── zustand-store.ts  useCounterStore + useTodoStore
│   ├── redux-store.ts    counterSlice + todoSlice + configureStore
│   └── external-store.ts subscribe/getSnapshot pattern + localStorage sync
└── index.css             Tailwind v4: @import "tailwindcss";
```

## Gotchas

- **TypeScript `verbatimModuleSyntax` + `erasableSyntaxOnly`** — `import type` required for type-only imports; no enum, namespace, or parameter properties
- **Tailwind v4** — `@import "tailwindcss"` in CSS, not PostCSS plugin. Theme in `@theme {}` block. `tailwind.config.js` exists only for IDE tooling
- **Path alias** — `@/` maps to `src/` (tsconfig paths + vite.resolve.alias)
- **antd v6** — Used for Layout/Sider/Menu only; no antd components in pages
- **Vite HMR** — configured with `usePolling: true` for Docker compatibility
- **No existing tests** — vitest `setupFiles` is commented out; no test files or test-setup exist yet. Use `@testing-library/react` + `jsdom` when adding tests

## Docker

```bash
docker compose up         # dev with hot reload (mounts ./src)
docker compose down
```

- Dev: `Dockerfile.dev` (node:20-alpine, npm dev on :80)
- Prod: `Dockerfile` (multi-stage → nginx:alpine) — `VITE_API_BASE_URL` build arg via `.env.docker`
- Backend at `http://localhost:8000` / `ws://localhost:8000`

## Notice

- 新增 demo 时，只需添加页面文件和路由，不要改动已有的 demo 文件
- lib/ 下的 store 实现是共享的，修改时要确保不影响已有 demo
