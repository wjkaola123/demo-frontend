import { useRef, useState, useEffect, useCallback } from 'react'

function DomSection() {
  const inputRef = useRef<HTMLInputElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ width: 0, height: 0 })

  const focusInput = () => inputRef.current?.focus()

  const scrollToBox = () => boxRef.current?.scrollIntoView({ behavior: 'smooth' })

  const measureBox = () => {
    if (boxRef.current) {
      const { width, height } = boxRef.current.getBoundingClientRect()
      setDims({ width: Math.round(width), height: Math.round(height) })
    }
  }

  return (
    <div className="border-2 border-blue-400 rounded-lg p-4">
      <h2 className="font-bold text-lg mb-2">1. useRef 操作 DOM</h2>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            placeholder="点击按钮聚焦我..."
            className="border rounded px-2 py-1 flex-1"
          />
          <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={focusInput}>聚焦输入框</button>
        </div>

        <div className="flex gap-2">
          <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={scrollToBox}>滚动到目标区域</button>
          <button className="bg-purple-500 text-white px-3 py-1 rounded" onClick={measureBox}>测量目标尺寸</button>
          {dims.width > 0 && <span className="text-sm text-gray-500 self-center">{dims.width} x {dims.height} px</span>}
        </div>

        <div className="h-48 overflow-y-auto border rounded p-2">
          <div className="h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400">上方占位区域</div>
          <div ref={boxRef} className="h-16 my-2 bg-yellow-200 rounded flex items-center justify-center font-semibold border-2 border-yellow-500">
            目标区域 (ref 绑定)
          </div>
          <div className="h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400">下方占位区域</div>
        </div>
      </div>

      <p className="text-gray-500 text-sm mt-3">
        inputRef 聚焦输入框, boxRef 滚动定位 + getBoundingClientRect 测量尺寸
      </p>
    </div>
  )
}

function StorageSection() {
  const [count, setCount] = useState(0)
  const renderCountRef = useRef(0)
  const clickCountRef = useRef(0)
  const [refInfo, setRefInfo] = useState({ renders: '—', clicks: '—' })

  useEffect(() => {
    renderCountRef.current += 1
  })

  const handleClick = (delta: number) => {
    clickCountRef.current += 1
    setCount(c => c + delta)
  }

  const inspectRefs = () => {
    setRefInfo({
      renders: String(renderCountRef.current),
      clicks: String(clickCountRef.current),
    })
  }

  return (
    <div className="border-2 border-orange-400 rounded-lg p-4">
      <h2 className="font-bold text-lg mb-2">2. useRef 作为数据存储 (不触发渲染)</h2>

      <div className="space-y-3">
        <p className="text-2xl font-mono">count: {count}</p>

        <div className="space-y-1">
          <button className="bg-gray-300 px-3 py-1 rounded text-sm" onClick={inspectRefs}>
            读取 ref 中保存的值
          </button>
          <div className="text-sm text-gray-500 space-y-0.5">
            <p>组件渲染次数: {refInfo.renders}</p>
            <p>按钮点击次数: {refInfo.clicks}</p>
            <p className="text-xs text-gray-400">
              ref 值随每次渲染/点击递增但不触发渲染 — 点击上方按钮手动读取
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="bg-orange-500 text-white px-4 py-1 rounded" onClick={() => handleClick(1)}>+1</button>
          <button className="bg-orange-500 text-white px-4 py-1 rounded" onClick={() => handleClick(-1)}>-1</button>
        </div>
      </div>

      <p className="text-gray-500 text-sm mt-3">
        renderCountRef 和 clickCountRef 持续累加, 但修改它们不触发重渲染; 多次点击 +1/-1 后按按钮可见
      </p>
    </div>
  )
}

function TimerSection() {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [timerSnap, setTimerSnap] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startTimer = () => {
    if (intervalRef.current !== null) return
    setRunning(true)
    intervalRef.current = setInterval(() => {
      setElapsed(prev => prev + 1)
    }, 1000)
  }

  const stopTimer = () => {
    clearTimer()
    setRunning(false)
  }

  const resetTimer = () => {
    clearTimer()
    setElapsed(0)
    setRunning(false)
  }

  const inspectTimer = () => {
    setTimerSnap(intervalRef.current !== null ? String(intervalRef.current) : 'null (已清除)')
  }

  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  return (
    <div className="border-2 border-red-400 rounded-lg p-4">
      <h2 className="font-bold text-lg mb-2">3. useRef 保存定时器对象</h2>

      <div className="space-y-3">
        <p className="text-3xl font-mono">{elapsed}s</p>
        <p className="text-sm">
          <button className="bg-gray-300 px-3 py-1 rounded text-sm" onClick={inspectTimer}>查看定时器 ID (ref 值)</button>
          {timerSnap !== null && <span className="ml-2 text-gray-500 text-xs font-mono">{timerSnap}</span>}
        </p>

        <div className="flex gap-2">
          {!running ? (
            <button className="bg-red-500 text-white px-4 py-1 rounded" onClick={startTimer}>启动定时器</button>
          ) : (
            <button className="bg-gray-500 text-white px-4 py-1 rounded" onClick={stopTimer}>停止定时器</button>
          )}
          <button className="bg-gray-400 text-white px-4 py-1 rounded" onClick={resetTimer}>重置</button>
        </div>
      </div>

      <p className="text-gray-500 text-sm mt-3">
        intervalRef 持有 setInterval ID, 不参与渲染; unmount 时 useEffect cleanup 自动清除
      </p>
    </div>
  )
}

export default function UseRefDemo() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">useRef Demo</h1>
      <p className="text-gray-500 mb-4">
        展示 useRef 的三种典型用法：操作 DOM、数据存储、管理定时器
      </p>
      <div className="flex flex-col gap-4">
        <DomSection />
        <StorageSection />
        <TimerSection />
      </div>
      <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
        <p className="font-semibold mb-1">useRef 特点:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>ref.current 的值变化不触发组件重新渲染 (区别于 useState)</li>
          <li>在整个组件生命周期中保持同一个引用 (区别于普通变量)</li>
          <li>适合存储 DOM 引用、定时器 ID、上次渲染的值等可变数据</li>
        </ul>
      </div>
    </div>
  )
}
