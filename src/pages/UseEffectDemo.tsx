import { useState, useEffect } from 'react'

function Timer() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return <p className="font-mono text-2xl tabular-nums">{count}s</p>
}

export default function UseEffectDemo() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    document.title = show ? 'Timer Running' : 'Timer Stopped'
    return () => { document.title = 'Demo Frontend' }
  }, [show])

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-2">React useEffect Demo</h1>
      <p className="text-muted-foreground mb-6">管理副作用：挂载/卸载计时器 + 同步 document.title</p>

      <div className="border rounded-lg p-6 flex flex-col items-center gap-4">
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
          onClick={() => setShow(s => !s)}
        >
          {show ? '卸载计时器' : '挂载计时器'}
        </button>
        {show && <Timer />}
        <p className="text-xs text-muted-foreground">
          document.title 随计时器开关同步更新；点击卸载时计时器自动清理
        </p>
      </div>

      <div className="mt-6 p-4 bg-muted rounded text-sm">
        <p className="font-semibold mb-1">useEffect 要点:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>空依赖 <code className="bg-muted px-1 rounded">[]</code> 仅在挂载时执行，返回的清理函数在卸载时执行</li>
          <li>有依赖时，副作用在依赖变化时重新执行，旧副作用的清理函数先执行</li>
          <li>清理函数可防止内存泄漏（如 clearInterval、取消订阅）</li>
          <li>不要对依赖撒谎——缺失依赖会导致闭包陷阱</li>
        </ul>
      </div>
    </div>
  )
}
