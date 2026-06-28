import { useState, useEffect, useLayoutEffect, useRef } from 'react'

function ExecutionOrderDemo() {
  const [count, setCount] = useState(0)
  const layoutRef = useRef<HTMLParagraphElement>(null)
  const effectRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    console.log('%c[useEffect]    执行 — 浏览器已绘制完毕', 'color: #ea580c; font-weight: bold')
    if (effectRef.current) {
      effectRef.current.textContent = `useEffect @ ${performance.now().toFixed(1)}ms`
    }
  })

  useLayoutEffect(() => {
    console.log('%c[useLayoutEffect] 执行 — DOM 变更后、绘制前', 'color: #16a34a; font-weight: bold')
    if (layoutRef.current) {
      layoutRef.current.textContent = `useLayoutEffect @ ${performance.now().toFixed(1)}ms`
    }
  })

  return (
    <div className="border rounded p-4 flex-1">
      <h3 className="font-bold text-lg mb-1">执行时机对比</h3>
      <p className="text-sm mb-2">count: {count}</p>
      <button
        className="px-3 py-1 rounded text-white text-sm cursor-pointer bg-gray-800 hover:bg-gray-700"
        onClick={() => setCount(c => c + 1)}
      >
        触发重渲染
      </button>
      <div className="mt-2 text-xs space-y-1">
        <p ref={layoutRef} className="text-green-600">—</p>
        <p ref={effectRef} className="text-orange-600">—</p>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        同一组件内两个 hook 的执行顺序（打开 Console 看带色日志）
      </p>
    </div>
  )
}

function ProgressBarDemo({ useLayout }: { useLayout: boolean }) {
  const name = useLayout ? 'useLayoutEffect' : 'useEffect'
  const hook = useLayout ? useLayoutEffect : useEffect
  const color = useLayout ? '#16a34a' : '#ea580c'
  const barRef = useRef<HTMLDivElement>(null)
  const [trigger, setTrigger] = useState(0)

  hook(() => {
    if (trigger > 0 && barRef.current) {
      if (useLayout) {
        barRef.current.style.transition = 'none'
        barRef.current.style.width = '100%'
        barRef.current.offsetHeight
        barRef.current.style.transition = ''
      } else {
        barRef.current.style.width = '100%'
      }
      console.log(`[${name}] 进度条宽度 → 100%`)
    }
  }, [trigger])

  const start = () => {
    if (barRef.current) {
      barRef.current.style.width = '0%'
      barRef.current.offsetHeight
    }
    setTrigger(t => t + 1)
  }

  return (
    <div className="border rounded p-4 flex-1 flex flex-col gap-3">
      <p className="font-semibold">{name}</p>
      <button
        className="px-3 py-1 rounded text-white text-sm cursor-pointer self-start"
        style={{ backgroundColor: color }}
        onClick={start}
      >
        开始填充
      </button>
      <div className="w-full h-12 rounded bg-gray-200 overflow-hidden relative">
        <div
          ref={barRef}
          className="h-full rounded flex items-center justify-end pr-3 text-white text-sm font-bold"
          style={{
            backgroundColor: color,
            width: '0%',
            transition: useLayout ? 'none' : 'width 2s ease-in-out',
          }}
        />
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">
        {useLayout
          ? 'useLayoutEffect 在绘制前已完成宽度变更 → 进度条直接显示满格，无填充过程'
          : 'useEffect 绘制后才变更宽度 → 从 0% 过渡到 100%，2s 动画肉眼可见'
        }
      </p>
    </div>
  )
}

function TooltipDemo({ useLayout }: { useLayout: boolean }) {
  const name = useLayout ? 'useLayoutEffect' : 'useEffect'
  const hook = useLayout ? useLayoutEffect : useEffect
  const color = useLayout ? '#16a34a' : '#ea580c'
  const triggerRef = useRef<HTMLButtonElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)
  const [version, setVersion] = useState(0)
  const coordsRef = useRef({ top: 0, left: 0 })

  hook(() => {
    if (show && tooltipRef.current) {
      const { top, left } = coordsRef.current
      console.log(`[${name}] tooltip 定位: (${left.toFixed(0)}, ${top.toFixed(0)})`)
      if (useLayout) {
        tooltipRef.current.style.transition = 'none'
        tooltipRef.current.style.top = `${top}px`
        tooltipRef.current.style.left = `${left}px`
        tooltipRef.current.offsetHeight
        tooltipRef.current.style.transition = ''
      } else {
        tooltipRef.current.style.top = `${top}px`
        tooltipRef.current.style.left = `${left}px`
      }
    }
  }, [show, version])

  useEffect(() => {
    if (!show) return
    const reposition = () => {
      if (triggerRef.current && tooltipRef.current) {
        const btn = triggerRef.current.getBoundingClientRect()
        tooltipRef.current.style.top = `${btn.bottom + 8}px`
        tooltipRef.current.style.left = `${btn.left}px`
      }
    }
    window.addEventListener('scroll', reposition, { capture: true })
    return () => window.removeEventListener('scroll', reposition, { capture: true })
  }, [show])

  const toggle = () => {
    if (show) {
      setShow(false)
    } else {
      if (triggerRef.current) {
        const btn = triggerRef.current.getBoundingClientRect()
        coordsRef.current = { top: btn.bottom + 8, left: btn.left }
      }
      setShow(true)
      setVersion(v => v + 1)
    }
  }

  return (
    <div className="border rounded p-4 flex-1 min-h-[180px] relative">
      <p className="font-semibold mb-2">{name}</p>
      <button
        ref={triggerRef}
        className="px-4 py-2 rounded text-white text-sm cursor-pointer"
        style={{ backgroundColor: color }}
        onClick={toggle}
      >
        {show ? '隐藏 Tooltip' : '显示 Tooltip'}
      </button>

      {show && (
        <div
          ref={tooltipRef}
          className="fixed rounded-lg px-4 py-3 text-white text-sm shadow-xl z-50 border-2 border-white/30"
          style={{
            backgroundColor: color,
            maxWidth: 200,
            top: 0,
            left: 0,
            transition: useLayout ? 'none' : 'top 0.35s ease, left 0.35s ease',
          }}
        >
          <p className="font-bold">{name}</p>
          <p className="text-xs mt-1 opacity-90">
            {useLayout
              ? '绘制前定位完毕 → 始终在按钮下方'
              : '先绘制在屏幕左上角 → 再移动到按钮下方'}
          </p>
        </div>
      )}
    </div>
  )
}

export default function UseLayoutEffectDemo() {
  return (
    <div className="p-8 max-w-4xl space-y-6 pb-12">
      <h1 className="text-2xl font-bold">useLayoutEffect vs useEffect 对比</h1>

      <section>
        <ExecutionOrderDemo />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">DOM 渲染对比：进度条</h2>
        <p className="text-xs text-gray-400 mb-3">
          注意：useLayoutEffect 侧明确禁用了 CSS transition。原因是 CSS 引擎在样式计算时检测的是<strong>属性值变化</strong>而非"是否已绘制"——即使 useLayoutEffect 在绘制前修正了属性，CSS transition 仍会启动动画。禁用 transition 恰是 useLayoutEffect 的正确语义：<strong>绘制前完成的变更不应产生视觉过渡</strong>。
        </p>
        <div className="flex gap-4">
          <ProgressBarDemo useLayout={false} />
          <ProgressBarDemo useLayout />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">DOM 渲染对比：Tooltip 定位</h2>
        <p className="text-sm text-gray-500 mb-3">
          Tooltip 初始 fixed 定位在屏幕左上角 (0,0)，effect 读取按钮坐标后重新定位。
          右侧 useLayoutEffect 在绘制前修正位置，tooltip 始终在按钮下方。
          左侧 useEffect 绘制后才修正，可观察到 tooltip 从左上角滑到按钮下方的 0.35s 动画。
        </p>
        <div className="flex gap-4">
          <TooltipDemo useLayout={false} />
          <TooltipDemo useLayout />
        </div>
      </section>

      <section className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">对比维度</th>
              <th className="p-3 text-left">useEffect</th>
              <th className="p-3 text-left">useLayoutEffect</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-3 font-medium">执行时机</td>
              <td className="p-3">浏览器绘制之后（异步）</td>
              <td className="p-3">DOM 变更后、绘制之前（同步）</td>
            </tr>
            <tr className="border-t">
              <td className="p-3 font-medium">执行方式</td>
              <td className="p-3">不阻塞渲染，异步调度</td>
              <td className="p-3">阻塞渲染，同步执行</td>
            </tr>
            <tr className="border-t">
              <td className="p-3 font-medium">DOM 渲染</td>
              <td className="p-3">先绘制初始态，effect 再更新 → 可见过渡/闪烁</td>
              <td className="p-3">绘制前完成所有更新 → 一次到位，无过渡</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  )
}
