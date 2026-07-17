import {
  useNavigate,
  useSearchParams,
  useLocation,
  useParams,
  Outlet,
  Link,
} from 'react-router-dom'

function InfoBlock({ title, code, children }: { title: string; code: string; children: React.ReactNode }) {
  return (
    <div className="border-2 border-blue-300 rounded-lg p-4 flex flex-col gap-2">
      <h2 className="font-bold text-lg">{title}</h2>
      <pre className="bg-muted p-2 rounded text-xs overflow-auto">{code}</pre>
      {children}
    </div>
  )
}

function JsonData({ data }: { data: unknown }) {
  return (
    <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-40">
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}

// ========== 1. Path Params ==========
function PathParamsDemo() {
  const { id } = useParams()
  return (
    <InfoBlock
      title="1. 路径参数 (Path Params)"
      code={`<Route path="/router-params/user/:id" element={<PathPage />} />
const { id } = useParams()`}
    >
      <p className="text-sm text-muted-foreground">
        通过 URL 路径中的 <code className="bg-muted px-1 rounded">:id</code> 占位符传递必填参数。
      </p>
      <div className="flex gap-2 mt-1">
        <Link to="/router-params/user/1" className="text-sm underline text-blue-600 hover:text-blue-800">/user/1</Link>
        <Link to="/router-params/user/2" className="text-sm underline text-blue-600 hover:text-blue-800">/user/2</Link>
        <Link to="/router-params/user/3" className="text-sm underline text-blue-600 hover:text-blue-800">/user/3</Link>
      </div>
      <div className="mt-2 p-3 bg-blue-50/50 dark:bg-blue-950/50 rounded border border-blue-200 dark:border-blue-800 text-sm">
        <p>当前 <code className="bg-muted px-1 rounded">useParams()</code> → <strong>id = {id ?? '(无)'}</strong></p>
      </div>
    </InfoBlock>
  )
}

// ========== 2. Query Params ==========
function QueryParamsDemo() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = searchParams.get('page') ?? '1'
  const sort = searchParams.get('sort') ?? 'asc'
  const filter = searchParams.get('filter') ?? ''

  function updateParams(key: string, value: string) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value) next.set(key, value)
      else next.delete(key)
      return next
    })
  }

  return (
    <InfoBlock
      title="2. 查询参数 (Query Params)"
      code={`const [searchParams, setSearchParams] = useSearchParams()
searchParams.get('page')
setSearchParams(prev => { ... })`}
    >
      <p className="text-sm text-muted-foreground">
        通过 URL 中的 <code className="bg-muted px-1 rounded">?key=value</code> 传递可选参数，适合搜索、筛选、分页。
      </p>
      <div className="flex flex-wrap gap-3 mt-2">
        <label className="flex items-center gap-1.5 text-sm">
          page:
          <select
            value={page}
            onChange={e => updateParams('page', e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </label>
        <label className="flex items-center gap-1.5 text-sm">
          sort:
          <select
            value={sort}
            onChange={e => updateParams('sort', e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="asc">asc</option>
            <option value="desc">desc</option>
          </select>
        </label>
        <label className="flex items-center gap-1.5 text-sm">
          filter:
          <input
            type="text"
            value={filter}
            onChange={e => updateParams('filter', e.target.value)}
            placeholder="关键词"
            className="border rounded px-2 py-1 text-sm"
          />
        </label>
      </div>
      <JsonData data={{ page, sort, filter }} />
    </InfoBlock>
  )
}

// ========== 3. Location State ==========
function LocationStateDemo() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { from?: string; message?: string } | null

  return (
    <InfoBlock
      title="3. 路由状态 (Location State)"
      code={`navigate('/router-params/state', {
  state: { from: 'list', message: '携带的数据' }
})
useLocation().state`}
    >
      <p className="text-sm text-muted-foreground">
        通过 <code className="bg-muted px-1 rounded">navigate(path, &#123; state &#125;)</code> 传递数据，不显示在 URL 中。
        刷新页面后 state 会丢失。
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        <button
          onClick={() => navigate('/router-params/state', { state: { from: '列表页', message: '点击了查看详情' } })}
          className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          navigate + state（来自列表页）
        </button>
        <button
          onClick={() => navigate('/router-params/state')}
          className="px-3 py-1.5 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
        >
          navigate 无 state
        </button>
      </div>
      <div className="mt-2 p-3 bg-purple-50/50 dark:bg-purple-950/50 rounded border border-purple-200 dark:border-purple-800 text-sm">
        <p className="font-medium mb-1">useLocation().state:</p>
        {state ? (
          <JsonData data={state} />
        ) : (
          <p className="text-muted-foreground text-xs">null — 无状态数据，点击上方按钮传递</p>
        )}
      </div>
    </InfoBlock>
  )
}

// ========== 4. Hash ==========
function HashDemo() {
  const navigate = useNavigate()
  const location = useLocation()

  const sections = ['introduction', 'usage', 'api', 'examples']
  return (
    <InfoBlock
      title="4. URL Hash（锚点）"
      code={`navigate('/router-params/hash#section-id')
location.hash`}
    >
      <p className="text-sm text-muted-foreground">
        通过 URL 中的 <code className="bg-muted px-1 rounded">#hash</code> 定位页面内锚点，常用于目录跳转。
      </p>
      <div className="flex gap-2 mt-2">
        {sections.map(s => (
          <button
            key={s}
            onClick={() => navigate(`/router-params/hash#${s}`)}
            className={`px-3 py-1.5 rounded text-sm border transition-colors ${
              location.hash === `#${s}`
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-background border-border hover:bg-muted'
            }`}
          >
            #{s}
          </button>
        ))}
      </div>
      <div className="mt-2 p-3 bg-green-50/50 dark:bg-green-950/50 rounded border border-green-200 dark:border-green-800 text-sm">
        <p>当前 <code className="bg-muted px-1 rounded">location.hash</code> → <strong>{location.hash || '(空)'}</strong></p>
        <p className="text-xs text-muted-foreground mt-1">注意：hash 变化不会触发组件重新渲染，需要监听 hashchange 事件。</p>
      </div>
    </InfoBlock>
  )
}

// ========== 5. 嵌套路由 + Outlet 传参 ==========
function NestedLayout() {
  const location = useLocation()
  return (
    <div className="border-2 border-purple-300 rounded-lg p-4 flex flex-col gap-3">
      <h2 className="font-bold text-lg">5. 嵌套路由 (Nested Routes + Outlet)</h2>
      <p className="text-sm text-muted-foreground">
        通过 <code className="bg-muted px-1 rounded">&lt;Outlet /&gt;</code> 渲染子路由，父路由路径参数自动传递给子组件。
      </p>
      <div className="flex gap-2">
        <Link to="/router-params/nested" className="text-sm underline text-blue-600">nested (默认)</Link>
        <Link to="/router-params/nested/profile/42" className="text-sm underline text-blue-600">nested/profile/42</Link>
        <Link to="/router-params/nested/profile/99" className="text-sm underline text-blue-600">nested/profile/99</Link>
        <Link to="/router-params/nested/settings" className="text-sm underline text-blue-600">nested/settings</Link>
      </div>
      <div className="p-3 bg-purple-50/50 dark:bg-purple-950/50 rounded border border-purple-200 dark:border-purple-800">
        <p className="text-xs text-muted-foreground mb-2">当前 pathname: <strong>{location.pathname}</strong></p>
        <Outlet />
      </div>
    </div>
  )
}

function NestedHome() {
  return <p className="text-sm">嵌套路由首页 — 默认子页面，通过 Outlet 渲染。</p>
}

function NestedProfile() {
  const { id } = useParams()
  return (
    <div className="text-sm">
      <p>Profile 子页面 — 从父路由继承 <code className="bg-muted px-1 rounded">:id</code> 参数</p>
      <p className="text-muted-foreground">useParams() → <strong>id = {id ?? '(无)'}</strong></p>
    </div>
  )
}

function NestedSettings() {
  return <p className="text-sm">Settings 子页面 — 无需参数。</p>
}

// ========== 五种方式汇总对比 ==========
function ComparisonTable() {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted">
            <th className="px-3 py-2 text-left font-medium">方式</th>
            <th className="px-3 py-2 text-left font-medium">URL 可见</th>
            <th className="px-3 py-2 text-left font-medium">刷新保留</th>
            <th className="px-3 py-2 text-left font-medium">读取方式</th>
            <th className="px-3 py-2 text-left font-medium">适用场景</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          <tr>
            <td className="px-3 py-2 font-medium">Path Params</td>
            <td className="px-3 py-2 text-green-600">是</td>
            <td className="px-3 py-2 text-green-600">是</td>
            <td className="px-3 py-2"><code className="bg-muted px-1 rounded text-xs">useParams()</code></td>
            <td className="px-3 py-2 text-muted-foreground">RESTful 资源标识、必填参数</td>
          </tr>
          <tr>
            <td className="px-3 py-2 font-medium">Query Params</td>
            <td className="px-3 py-2 text-green-600">是</td>
            <td className="px-3 py-2 text-green-600">是</td>
            <td className="px-3 py-2"><code className="bg-muted px-1 rounded text-xs">useSearchParams()</code></td>
            <td className="px-3 py-2 text-muted-foreground">筛选、排序、分页、搜索</td>
          </tr>
          <tr>
            <td className="px-3 py-2 font-medium">Location State</td>
            <td className="px-3 py-2 text-red-600">否</td>
            <td className="px-3 py-2 text-red-600">否</td>
            <td className="px-3 py-2"><code className="bg-muted px-1 rounded text-xs">useLocation().state</code></td>
            <td className="px-3 py-2 text-muted-foreground">临时数据传递、表单状态</td>
          </tr>
          <tr>
            <td className="px-3 py-2 font-medium">Hash</td>
            <td className="px-3 py-2 text-green-600">是 (#)</td>
            <td className="px-3 py-2 text-green-600">是</td>
            <td className="px-3 py-2"><code className="bg-muted px-1 rounded text-xs">location.hash</code></td>
            <td className="px-3 py-2 text-muted-foreground">页面内锚点定位</td>
          </tr>
          <tr>
            <td className="px-3 py-2 font-medium">嵌套路由</td>
            <td className="px-3 py-2 text-green-600">是</td>
            <td className="px-3 py-2 text-green-600">是</td>
            <td className="px-3 py-2"><code className="bg-muted px-1 rounded text-xs">Outlet + useParams()</code></td>
            <td className="px-3 py-2 text-muted-foreground">布局共享、父子路由参数传递</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// ========== 主页面 ==========
export default function RouterParamsDemo() {
  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-2">React Router 传参方式 Demo</h1>
      <p className="text-muted-foreground mb-6">
        展示五种路由传参方式的用法与区别
      </p>

      <div className="mb-6 p-4 bg-muted border border-border rounded text-sm">
        <p className="font-semibold mb-1">操作说明：</p>
        <p>点击各区域的链接或按钮，观察 URL 和下方数据展示区的变化。
        对比各方式的 URL 可见性、刷新后是否保留等特性。</p>
      </div>

      <div className="flex flex-col gap-6">
        <PathParamsDemo />
        <QueryParamsDemo />
        <LocationStateDemo />
        <HashDemo />
        <NestedLayout />
        <ComparisonTable />
      </div>
    </div>
  )
}

export { NestedHome, NestedProfile, NestedSettings }
