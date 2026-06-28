import { useRef, useImperativeHandle, forwardRef, useState } from 'react'

interface CustomInputHandle {
  focus: () => void
  clear: () => void
}

const CustomInput = forwardRef<CustomInputHandle>((_, ref) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => {
      if (inputRef.current) inputRef.current.value = ''
    },
  }))

  return (
    <input
      ref={inputRef}
      placeholder="这是一个自定义输入框..."
      className="border rounded px-2 py-1 flex-1"
    />
  )
})

function InputSection() {
  const ref = useRef<CustomInputHandle>(null)

  return (
    <div className="border-2 border-blue-400 rounded-lg p-4">
      <h2 className="font-bold text-lg mb-2">1. 自定义 Input — 暴露 focus() / clear()</h2>
      <div className="flex items-center gap-2">
        <CustomInput ref={ref} />
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
          onClick={() => ref.current?.focus()}
        >
          聚焦
        </button>
        <button
          className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
          onClick={() => ref.current?.clear()}
        >
          清空
        </button>
      </div>
      <p className="text-gray-500 text-sm mt-2">
        forwardRef 将 ref 转发到子组件，useImperativeHandle 限制父组件只能调用 focus/clear
      </p>
    </div>
  )
}

interface StopwatchHandle {
  start: () => void
  stop: () => void
  reset: () => void
}

const Stopwatch = forwardRef<StopwatchHandle>((_, ref) => {
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useImperativeHandle(ref, () => ({
    start: () => {
      if (timerRef.current !== null) return
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    },
    stop: () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    },
    reset: () => {
      if (timerRef.current !== null) clearInterval(timerRef.current)
      timerRef.current = null
      setElapsed(0)
    },
  }))

  return (
    <p className="text-2xl font-mono">{elapsed}s</p>
  )
})

function StopwatchSection() {
  const ref = useRef<StopwatchHandle>(null)

  return (
    <div className="border-2 border-green-400 rounded-lg p-4">
      <h2 className="font-bold text-lg mb-2">2. 秒表组件 — 暴露 start() / stop() / reset()</h2>
      <div className="flex items-center gap-4 mb-2">
        <Stopwatch ref={ref} />
        <div className="flex gap-2">
          <button
            className="bg-green-500 text-white px-3 py-1 rounded text-sm"
            onClick={() => ref.current?.start()}
          >
            开始
          </button>
          <button
            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
            onClick={() => ref.current?.stop()}
          >
            暂停
          </button>
          <button
            className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
            onClick={() => ref.current?.reset()}
          >
            重置
          </button>
        </div>
      </div>
      <p className="text-gray-500 text-sm mt-2">
        秒表内部管理自己的 state 和定时器；父组件通过 ref 只拿到 start/stop/reset 三个方法
      </p>
    </div>
  )
}

export default function UseImperativeHandleDemo() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">useImperativeHandle Demo</h1>
      <p className="text-gray-500 mb-4">
        配合 forwardRef，让子组件选择性地暴露方法给父组件调用
      </p>
      <div className="flex flex-col gap-4">
        <InputSection />
        <StopwatchSection />
      </div>
      <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
        <p className="font-semibold mb-1">useImperativeHandle 特点:</p>
        <ul className="list-disc pl-4 space-y-1 mb-3">
          <li>必须与 forwardRef 配合使用，ref 才能传入子组件</li>
          <li>通过第二个参数（工厂函数）精确控制暴露给父组件的实例方法</li>
          <li>适合封装命令式 API（如 focus、scrollTo、reset），保持组件内部的封装性</li>
          <li>第三个参数（依赖数组）控制在依赖变化时重新创建 handle 对象</li>
        </ul>

        <p className="font-semibold mb-1">常见使用场景:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li><strong>封装第三方库的实例方法</strong> — 如地图组件暴露 panTo/zoomTo，图表组件暴露 exportImage</li>
          <li><strong>自定义表单控件</strong> — 暴露 focus、reset、validate 等方法供父组件统一调用</li>
          <li><strong>动画/动画控件</strong> — 父组件通过 ref 控制子组件的播放、暂停、跳转</li>
          <li><strong>模态框/抽屉</strong> — 暴露 open、close 方法，比 props 控制的 show/hide 状态更直观</li>
          <li><strong>滚动容器</strong> — 暴露 scrollTo、scrollToTop、scrollToBottom 等滚动方法</li>
          <li><strong>多步骤表单</strong> — 每步暴露 validate 和 getData，父组件统一收集和提交</li>
        </ul>
      </div>
    </div>
  )
}
