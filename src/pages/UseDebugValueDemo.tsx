import { useRef, useState, useDebugValue, useSyncExternalStore } from 'react'

function useOnlineStatus() {
  const status = useSyncExternalStore(
    (cb) => {
      window.addEventListener('online', cb)
      window.addEventListener('offline', cb)
      return () => {
        window.removeEventListener('online', cb)
        window.removeEventListener('offline', cb)
      }
    },
    () => navigator.onLine,
  )

  useDebugValue(status ? 'Online' : 'Offline')

  return status
}

function useWindowSize() {
  const cache = useRef<{ width: number; height: number } | undefined>(undefined)
  const getSnapshot = () => {
    const next = { width: window.innerWidth, height: window.innerHeight }
    if (cache.current && cache.current.width === next.width && cache.current.height === next.height) return cache.current
    cache.current = next
    return next
  }

  const size = useSyncExternalStore(
    (cb) => {
      window.addEventListener('resize', cb)
      return () => window.removeEventListener('resize', cb)
    },
    getSnapshot,
  )

  useDebugValue(size, (s) => `w:${s.width} x h:${s.height}`)

  return size
}

function useCounter(initial: number) {
  const [count, setCount] = useState(initial)
  return { count, increment: () => setCount((c) => c + 1), decrement: () => setCount((c) => c - 1) }
}

function OnlineStatusSection() {
  const isOnline = useOnlineStatus()
  return (
    <div className="border-2 border-green-400 rounded-lg p-4 flex flex-col gap-3">
      <h2 className="font-bold text-lg">useDebugValue 基础用法</h2>
      <p className="text-sm text-muted-foreground">
        <code className="bg-muted px-1 rounded">useOnlineStatus</code> 在 DevTools 中显示
        当前网络状态标签（Online / Offline）。
      </p>
      <div className="flex items-center gap-3">
        <div
          className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}
        />
        <span className="text-lg font-semibold">{isOnline ? '在线' : '离线'}</span>
      </div>
      <p className="text-xs text-muted-foreground">
        打开 React DevTools → Components → 选中此组件，在 hooks 区域可看到
        <code className="bg-muted px-1 rounded">OnlineStatus: "Online"</code> 或
        <code className="bg-muted px-1 rounded">"Offline"</code>。
      </p>
    </div>
  )
}

function WindowSizeSection() {
  const size = useWindowSize()
  return (
    <div className="border-2 border-blue-400 rounded-lg p-4 flex flex-col gap-3">
      <h2 className="font-bold text-lg">useDebugValue + 格式化函数</h2>
      <p className="text-sm text-muted-foreground">
        <code className="bg-muted px-1 rounded">useWindowSize</code> 使用格式化函数
        <code className="bg-muted px-1 rounded">{'useDebugValue(value, formatFn)'}</code>，
        格式化仅在 DevTools 展开该 hook 时执行（延迟格式化）。
      </p>
      <div className="flex gap-4 text-sm font-mono">
        <span>宽度: <strong>{size.width}px</strong></span>
        <span>高度: <strong>{size.height}px</strong></span>
      </div>
      <p className="text-xs text-muted-foreground">
        调整浏览器窗口大小，然后在 DevTools 中观察 hook 的 debug label 同步更新。
        格式化函数使用场景：debug value 的格式化开销较大时，推迟到真正需要展示时才计算。
      </p>
    </div>
  )
}

function CompareSection() {
  const counter1 = useCounter(0)
  const counter2 = useCounter(10)

  return (
    <div className="border-2 border-orange-400 rounded-lg p-4 flex flex-col gap-3">
      <h2 className="font-bold text-lg">对比：未使用 useDebugValue 的 Hook</h2>
      <p className="text-sm text-muted-foreground">
        <code className="bg-muted px-1 rounded">useCounter</code> 没有调用
        <code className="bg-muted px-1 rounded">useDebugValue</code>，
        在 DevTools 中只显示 "No value" 或 hooks 名称。
      </p>
      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 bg-muted rounded hover:bg-secondary transition-colors text-sm"
            onClick={counter1.decrement}
          >
            -
          </button>
          <span className="text-lg font-mono w-8 text-center">{counter1.count}</span>
          <button
            className="px-3 py-1 bg-muted rounded hover:bg-secondary transition-colors text-sm"
            onClick={counter1.increment}
          >
            +
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 bg-muted rounded hover:bg-secondary transition-colors text-sm"
            onClick={counter2.decrement}
          >
            -
          </button>
          <span className="text-lg font-mono w-8 text-center">{counter2.count}</span>
          <button
            className="px-3 py-1 bg-muted rounded hover:bg-secondary transition-colors text-sm"
            onClick={counter2.increment}
          >
            +
          </button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        对比 DevTools：上方两个 hook 有有意义的 debug label，而 useCounter 没有。
      </p>
    </div>
  )
}

export default function UseDebugValueDemo() {
  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-2">useDebugValue Demo</h1>
      <p className="text-muted-foreground mb-6">
        在 React DevTools 中为自定义 Hook 添加可读标签，方便调试
      </p>

      <div className="mb-6 p-4 bg-muted border border-border rounded text-sm">
        <p className="font-semibold mb-1">操作说明：</p>
        <ul className="list-disc pl-4 space-y-0.5">
          <li>打开 <strong>React DevTools</strong> → Components 面板</li>
          <li>选中使用自定义 Hook 的组件（如 OnlineStatusSection 或 WindowSizeSection）</li>
          <li>在右侧 hooks 区域查看自定义 Hook 名称后面显示的 debug label</li>
          <li>对比 useCounter（无 debug label）与上方两个 Hook（有 debug label）的区别</li>
        </ul>
      </div>

      <div className="flex flex-col gap-6">
        <OnlineStatusSection />
        <WindowSizeSection />
        <CompareSection />
      </div>

      <div className="mt-6 p-4 bg-muted rounded text-sm">
        <p className="font-semibold mb-1">要点:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>
            <code className="bg-muted px-1 rounded">useDebugValue(value)</code> — 在 React DevTools 中为自定义 Hook 显示调试标签
          </li>
          <li>
            <code className="bg-muted px-1 rounded">useDebugValue(value, formatFn)</code> — 仅在 DevTools 展开该 hook 时才执行 <code className="bg-muted px-1 rounded">formatFn</code>，
            避免每次渲染都调用昂贵的格式化
          </li>
          <li>useDebugValue 仅用于自定义 Hook，不能直接在组件中调用</li>
          <li>调试标签仅在 React DevTools 中可见，不影响运行时行为</li>
          <li>添加 useDebugValue 不会产生运行时开销 — React 在生产模式下会跳过它</li>
        </ul>
      </div>
    </div>
  )
}
