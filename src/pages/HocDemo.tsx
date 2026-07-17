import { useState } from 'react'

// ====== HOC: withLoading ======

interface WithLoadingProps {
  loading: boolean
}

function withLoading<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & WithLoadingProps> {
  return function WithLoading(props: P & WithLoadingProps) {
    if (props.loading) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground py-4">
          <span className="inline-block w-4 h-4 border-2 border-border border-t-blue-500 rounded-full animate-spin" />
          加载中...
        </div>
      )
    }
    return <Component {...props} />
  }
}

// ====== HOC: withLogger ======

function withLogger<P extends object>(
  Component: React.ComponentType<P>,
  name: string
): React.FC<P> {
  return function WithLogger(props: P) {
    console.log(`[withLogger] ${name} 渲染`, props)
    return <Component {...props} />
  }
}

// ====== HOC: withToggle ======

interface WithToggleProps {
  value: boolean
  toggle: () => void
  setValue: (v: boolean) => void
}

function withToggle<P extends object>(
  Component: React.ComponentType<P & WithToggleProps>
): React.FC<P & { defaultVal?: boolean }> {
  return function WithToggle(props: P & { defaultVal?: boolean }) {
    const { defaultVal = false, ...rest } = props
    const [value, setValue] = useState(defaultVal)
    const toggle = () => setValue(v => !v)
    return (
      <Component
        {...(rest as P)}
        value={value}
        toggle={toggle}
        setValue={setValue}
      />
    )
  }
}

// ====== 被包裹的组件 ======

interface UserListProps {
  users: { id: number; name: string }[]
}

function UserList({ users }: UserListProps) {
  return (
    <ul className="divide-y">
      {users.map(u => (
        <li key={u.id} className="py-1.5 text-sm">{u.name}</li>
      ))}
    </ul>
  )
}

const UserListWithLoading = withLoading(UserList)

interface TogglePanelProps {
  title: string
  children: React.ReactNode
}

function TogglePanel({ title, value, toggle, children }: TogglePanelProps & WithToggleProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-2 bg-muted/50 hover:bg-muted text-left font-medium"
        onClick={toggle}
      >
        {title}
        <span className={`transition-transform ${value ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {value && <div className="p-4 border-t">{children}</div>}
    </div>
  )
}

const TogglePanelWithToggle = withToggle(TogglePanel)

// ====== 主页面 ======

export default function HocDemo() {
  const [loading, setLoading] = useState(true)
  const [users] = useState([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
  ])

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-2">HOC（高阶组件）Demo</h1>
      <p className="text-muted-foreground mb-6">
        高阶组件是一个函数，接收一个组件并返回一个新组件，用于横切关注点的复用
      </p>

      {/* withLoading */}
      <div className="border-2 border-blue-400 rounded-lg p-4 mb-6">
        <h2 className="font-bold text-lg mb-1">withLoading</h2>
        <p className="text-sm text-muted-foreground mb-3">
          向组件注入 loading prop，loading 为 true 时显示加载态
        </p>

        <div className="mb-3">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={loading}
              onChange={(e) => setLoading(e.target.checked)}
            />
            显示加载状态
          </label>
        </div>

        <UserListWithLoading loading={loading} users={users} />
      </div>

      {/* withLogger */}
      <div className="border-2 border-green-400 rounded-lg p-4 mb-6">
        <h2 className="font-bold text-lg mb-1">withLogger</h2>
        <p className="text-sm text-muted-foreground mb-3">
          包裹组件后每次渲染都会在控制台打印日志，用于调试
        </p>

        <LoggerDemoInner />
      </div>

      {/* withToggle */}
      <div className="border-2 border-orange-400 rounded-lg p-4 mb-6">
        <h2 className="font-bold text-lg mb-1">withToggle</h2>
        <p className="text-sm text-muted-foreground mb-3">
          注入 value / toggle / setValue 三个 props，让任意组件获得开关能力
        </p>

        <div className="flex flex-col gap-3">
          <TogglePanelWithToggle title="基本信息" defaultVal>
            <p className="text-sm text-muted-foreground">
              HOC 将 toggle 逻辑抽象出来，TogglePanel 只需关注渲染。
            </p>
          </TogglePanelWithToggle>

          <TogglePanelWithToggle title="高级设置">
            <p className="text-sm text-muted-foreground">
              每个实例有独立的状态，因为 withToggle 内部调用了 useState。
            </p>
          </TogglePanelWithToggle>
        </div>
      </div>

      {/* 要点 */}
      <div className="p-4 bg-muted rounded text-sm">
        <p className="font-semibold mb-1">要点:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>HOC 模式：<code className="bg-muted px-1 rounded">withX(Component) → EnhancedComponent</code></li>
          <li>用于横切关注点 — 每个 HOC 只关注一个功能（加载、日志、权限等）</li>
          <li>可组合：<code className="bg-muted px-1 rounded">withLogger(withLoading(MyComponent))</code></li>
          <li>React 16.8+ 后很多场景可用 Hook 替代，但 HOC 在部分遗留代码和库中仍常见（如 connect）</li>
        </ul>
      </div>
    </div>
  )
}

// ====== LoggerDemoInner（避免 HOC 在组件定义内创建） ======

const SimpleCard = withLogger(function SimpleCard() {
  return <div className="p-3 bg-muted border border-border rounded text-sm text-muted-foreground">打开控制台查看渲染日志</div>
}, 'SimpleCard')

function LoggerDemoInner() {
  const [count, setCount] = useState(0)
  return (
    <div className="flex flex-col gap-3">
      <button
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-fit"
        onClick={() => setCount(c => c + 1)}
      >
        触发重渲染 ({count})
      </button>
      <SimpleCard />
    </div>
  )
}
