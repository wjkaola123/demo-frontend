# demo-frontend

React 状态管理与 Hooks 演示项目，包含 11 个 Demo，分为 3 个类别。

## 技术栈

React 19 · TypeScript 6.0 · Vite 8 · Tailwind v4 · antd v6 · react-router-dom v7

## 快速开始

```bash
npm install
npm run dev        # http://localhost:5173
```

Docker 方式：

```bash
docker compose up   # http://localhost:80（热更新）
docker compose down
```

## Demo 列表

### 全局状态管理库

| Demo | 方案 | 说明 |
|------|------|------|
| ZustandDemo | Zustand | 轻量 store（counter + todo） |
| ReduxDemo | Redux Toolkit | createSlice + configureStore |

### React 原生 Hooks

| Demo | Hook | 说明 |
|------|------|------|
| ImmerDemo | useImmer | 可变语法操作不可变状态 |
| ExternalStoreDemo | useSyncExternalStore | 外部 store + localStorage 同步 |
| TransitionDemo | useTransition | 标记非紧急更新 |
| DeferredValueDemo | useDeferredValue | 延迟更新低优先级值 |
| UseEffectDemo | useEffect | 副作用处理 |
| UseLayoutEffectDemo | useLayoutEffect | 同步 DOM 操作 |
| UseRefDemo | useRef | DOM 引用与可变值 |
| UseImperativeHandleDemo | useImperativeHandle | 暴露子组件方法 |

### 跨层通信

| Demo | 方案 | 说明 |
|------|------|------|
| CrossLayerDemo | Context + EventBus | 跨层级组件通信（发布订阅） |

## 项目结构

```
src/
├── main.tsx          入口
├── App.tsx           布局 + 路由
├── components/       公共组件（Sidebar）
├── pages/            11 个 Demo 页面
├── lib/              状态管理实现（store、context、event-bus）
└── index.css         Tailwind v4 入口
```

## 命令

```bash
npm run dev          # Vite 开发服务器
npm run build        # 类型检查 + 构建
npm run preview      # 预览构建产物
npm run lint         # ESLint 检查
npm run test         # Vitest 运行测试
```
