import { useState } from 'react'
import { useNavigate, Outlet, Link, useParams, useLocation } from 'react-router-dom'

function TabA() {
  const params = useParams()
  const location = useLocation()
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">子路由 A — 动态参数演示</h3>
      <p className="text-muted-foreground text-sm mb-2">
        当前路由参数: <code className="bg-muted px-1 rounded">id = {params.id || '(无)'}</code>
      </p>
      <pre className="bg-muted p-3 rounded text-xs overflow-auto">
        {JSON.stringify({ pathname: location.pathname, params }, null, 2)}
      </pre>
      <div className="flex gap-2 mt-3">
        <Link to="/router-demo/123" className="text-sm underline text-blue-600">
          跳转到 /router-demo/123
        </Link>
        <Link to="/router-demo/456" className="text-sm underline text-blue-600">
          跳转到 /router-demo/456
        </Link>
      </div>
    </div>
  )
}

function TabB() {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">子路由 B</h3>
      <p className="text-muted-foreground text-sm">
        这是嵌套路由中的第二个子页面。通过 <code className="bg-muted px-1 rounded">&lt;Outlet /&gt;</code> 渲染。
      </p>
    </div>
  )
}

function DeclarativeRouting() {
  return (
    <div className="border-2 border-blue-300 rounded-lg p-4 flex flex-col gap-3">
      <h2 className="font-bold text-lg">1. 声明式路由 (Declarative)</h2>
      <p className="text-sm text-muted-foreground">
        通过 <code className="bg-muted px-1 rounded">&lt;Routes&gt;</code> + <code className="bg-muted px-1 rounded">&lt;Route&gt;</code> 组件声明路径与页面的映射关系。
        当前页面本身就是一个声明式路由入口。
      </p>
      <pre className="bg-muted p-3 rounded text-xs overflow-auto">
{`<Routes>
  <Route path="/router-demo" element={<RouterDemo />}>
    <Route path=":id?" element={<TabA />} />
    <Route path="tab-b" element={<TabB />} />
  </Route>
</Routes>`}
      </pre>
    </div>
  )
}

function ProgrammaticNavigation() {
  const navigate = useNavigate()
  const [inputPath, setInputPath] = useState('/router-demo/tab-b')

  return (
    <div className="border-2 border-green-400 rounded-lg p-4 flex flex-col gap-3">
      <h2 className="font-bold text-lg">2. 编程式导航 (Programmatic Navigation)</h2>
      <p className="text-sm text-muted-foreground">
        使用 <code className="bg-muted px-1 rounded">useNavigate()</code> hook 在代码中触发跳转。
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => navigate('/router-demo/tab-b')}
          className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          navigate('/router-demo/tab-b')
        </button>
        <button
          onClick={() => navigate('/router-demo/999')}
          className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700"
        >
          navigate('/router-demo/999')
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1.5 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
        >
          navigate(-1) 后退
        </button>
        <button
          onClick={() => navigate('/router-demo/tab-b', { replace: true })}
          className="px-3 py-1.5 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
        >
          navigate(path, &#123; replace: true &#125;)
        </button>
      </div>

      <div className="flex gap-2 items-center mt-2">
        <input
          className="border rounded px-3 py-1.5 text-sm flex-1"
          placeholder="输入路径..."
          value={inputPath}
          onChange={(e) => setInputPath(e.target.value)}
        />
        <button
          onClick={() => navigate(inputPath)}
          className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
        >
          跳转
        </button>
      </div>

      <pre className="bg-muted p-3 rounded text-xs overflow-auto mt-2">
{`const navigate = useNavigate();
navigate('/router-demo/tab-b');
navigate(-1);                   // 后退
navigate('/page', { replace: true });`}
      </pre>
    </div>
  )
}

function NestedRouting() {
  return (
    <div className="border-2 border-purple-300 rounded-lg p-4 flex flex-col gap-3">
      <h2 className="font-bold text-lg">3. 嵌套路由 (Nested Routes)</h2>
      <p className="text-sm text-muted-foreground">
        父路由中使用 <code className="bg-muted px-1 rounded">&lt;Outlet /&gt;</code> 占位，
        子路由在父路由的 <code className="bg-muted px-1 rounded">&lt;Route&gt;</code> 内嵌套声明。
        下面就是嵌套渲染的区域：
      </p>

      <div className="border-2 border-dashed border-purple-400 rounded-lg p-3 bg-purple-50/30 dark:bg-purple-950/30">
        <p className="text-xs text-muted-foreground mb-2 font-semibold">Outlet 渲染区域：</p>
        <Outlet />
      </div>

      <div className="mt-2 p-3 bg-muted rounded text-sm">
        <p className="font-semibold mb-1">嵌套路由结构：</p>
        <pre className="text-xs overflow-auto mt-1">
{`<Route path="/router-demo" element={<RouterDemo />}>
  <Route path=":id?" element={<TabA />} />   {/* 可选的动态参数 */}
  <Route path="tab-b" element={<TabB />} />
</Route>`}
        </pre>
        <p className="mt-2 text-xs text-muted-foreground">
          点击下方可跳转到的子路由链接：
        </p>
        <div className="flex flex-wrap gap-2 mt-1">
          <Link to="/router-demo" className="text-xs underline text-blue-600">/router-demo (默认 tab-a)</Link>
          <Link to="/router-demo/tab-b" className="text-xs underline text-blue-600">/router-demo/tab-b</Link>
          <Link to="/router-demo/888" className="text-xs underline text-blue-600">/router-demo/888 (动态id)</Link>
          <Link to="/router-demo/xyz" className="text-xs underline text-blue-600">/router-demo/xyz (动态id)</Link>
        </div>
      </div>
    </div>
  )
}

function FrameworkMode() {
  return (
    <div className="border-2 border-gray-300 rounded-lg p-4 flex flex-col gap-3 opacity-80">
      <h2 className="font-bold text-lg">4. 框架模式 (Framework Mode) — 仅展示</h2>
      <p className="text-sm text-muted-foreground">
        React Router v7 新增的框架模式，需要改变项目入口和构建配置，当前项目使用 library 模式，
        无法实际演示。这里展示其声明式配置方式：
      </p>
      <pre className="bg-muted p-3 rounded text-xs overflow-auto">
{`// routes.ts — 框架模式的集中式路由配置
import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  // 布局路由
  layout("./layout.tsx", [
    index("./home.tsx"),
    route("dashboard", "./dashboard.tsx", [
      index("./dashboard-home.tsx"),
      route("settings", "./dashboard-settings.tsx"),
    ]),
    route("about", "./about.tsx"),
  ]),
] satisfies RouteConfig;

// --- 关键区别 ---
// library 模式: BrowserRouter/Routes/Route 组件
// framework 模式: route()/index()/layout() 配置函数 + 文件约定 (loader/action/meta)`}
      </pre>
      <p className="text-xs text-muted-foreground mt-1">
        框架模式还支持每个路由的 <code className="bg-muted px-1 rounded">loader</code>、
        <code className="bg-muted px-1 rounded">action</code>、<code className="bg-muted px-1 rounded">ErrorBoundary</code>、
        <code className="bg-muted px-1 rounded">meta</code> 等导出，实现数据预加载、表单处理、错误边界和 SEO。
      </p>
    </div>
  )
}

export default function RouterDemo() {
  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-2">React Router v7 四种路由模式 Demo</h1>
      <p className="text-muted-foreground mb-6">
        展示 react-router v7 的声明式路由、编程式导航、嵌套路由，以及框架模式说明
      </p>

      <div className="flex flex-col gap-6">
        <DeclarativeRouting />
        <ProgrammaticNavigation />
        <NestedRouting />
        <FrameworkMode />
      </div>

      <div className="mt-6 p-4 bg-muted rounded text-sm">
        <p className="font-semibold mb-1">React Router v7 核心 Hooks / 组件:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li><code className="bg-muted px-1 rounded">useNavigate()</code> — 返回 navigate 函数，用于编程式跳转</li>
          <li><code className="bg-muted px-1 rounded">useParams()</code> — 读取 URL 动态参数 (:id)</li>
          <li><code className="bg-muted px-1 rounded">useLocation()</code> — 获取当前 location 对象 (pathname, search, hash)</li>
          <li><code className="bg-muted px-1 rounded">&lt;Outlet /&gt;</code> — 嵌套路由的子路由渲染出口</li>
          <li><code className="bg-muted px-1 rounded">&lt;Link to&gt;</code> — 声明式导航链接（等同于 &lt;a&gt;，但无页面刷新）</li>
          <li><code className="bg-muted px-1 rounded">&lt;Routes&gt; / &lt;Route&gt;</code> — 声明式路由映射（library 模式）</li>
          <li><code className="bg-muted px-1 rounded">route() / index() / layout()</code> — 框架模式集中式路由配置</li>
        </ul>
      </div>
    </div>
  )
}

export { TabA, TabB }