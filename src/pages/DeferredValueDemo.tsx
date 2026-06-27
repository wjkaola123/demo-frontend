import { useState, useDeferredValue, useMemo, type ChangeEvent } from 'react'

const ROWS = 100
const COLS = 100
const PREVIEW_ROWS = 10

function computeColor(offset: number, row: number, col: number): string {
  const r = Math.sin(offset * 0.1 + row * 0.3 + col * 0.7) * 127 + 128
  const g = Math.sin(offset * 0.2 + row * 0.5 + col * 0.2) * 127 + 128
  const b = Math.sin(offset * 0.3 + row * 0.7 + col * 0.5) * 127 + 128
  return `rgb(${r | 0}, ${g | 0}, ${b | 0})`
}

function ColorGrid({ offset, maxRows = ROWS }: { offset: number; maxRows?: number }) {
  const grid = useMemo(() => {
    const rows: React.ReactNode[] = []
    for (let r = 0; r < maxRows; r++) {
      const cells: React.ReactNode[] = []
      for (let c = 0; c < COLS; c++) {
        cells.push(
          <div
            key={`${r}-${c}`}
            style={{
              width: 5,
              height: 5,
              backgroundColor: computeColor(offset, r, c),
              flexShrink: 0,
            }}
          />
        )
      }
      rows.push(
        <div key={r} className="flex">
          {cells}
        </div>
      )
    }
    return rows
  }, [offset, maxRows])

  return <div className="flex flex-col">{grid}</div>
}

function WithoutDeferred() {
  const [offset, setOffset] = useState(0)

  return (
    <div className="border-2 border-red-300 rounded-lg p-4 flex flex-col gap-3">
      <h2 className="font-bold text-lg">不使用 useDeferredValue</h2>
      <p className="text-xs text-gray-500">
        直接使用 offset 渲染 Grid，每次拖拽都触发完整重渲染
      </p>
      <input
        type="range"
        min={0}
        max={500}
        value={offset}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setOffset(Number(e.target.value))}
        className="w-full"
      />
      <div className="text-center font-mono text-lg tabular-nums">{offset}</div>
      <ColorGrid offset={offset} maxRows={offset === 0 ? PREVIEW_ROWS : ROWS} />
      {offset === 0 && (
        <p className="text-xs text-gray-400">显示前 {PREVIEW_ROWS} 行，共 {ROWS} 行。拖动滑块查看完整效果。</p>
      )}
    </div>
  )
}

function WithDeferred() {
  const [offset, setOffset] = useState(0)
  const deferredOffset = useDeferredValue(offset)
  const isStale = offset !== deferredOffset

  return (
    <div className="border-2 border-green-400 rounded-lg p-4 flex flex-col gap-3">
      <h2 className="font-bold text-lg">使用 useDeferredValue</h2>
      <p className="text-xs text-gray-500">
        offset 立即更新，Grid 使用延迟后的值渲染
      </p>
      <input
        type="range"
        min={0}
        max={500}
        value={offset}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setOffset(Number(e.target.value))}
        className="w-full"
      />
      <div className="text-center font-mono text-lg tabular-nums">
        {deferredOffset}
        {isStale && (
          <span className="text-green-600 text-sm ml-2 animate-pulse">
            延迟渲染中...
          </span>
        )}
      </div>
      <div
        className={`transition-opacity duration-200 ${
          isStale ? 'opacity-40' : 'opacity-100'
        }`}
      >
        <ColorGrid offset={deferredOffset} maxRows={offset === 0 ? PREVIEW_ROWS : ROWS} />
      </div>
      {offset === 0 && (
        <p className="text-xs text-gray-400">显示前 {PREVIEW_ROWS} 行，共 {ROWS} 行。拖动滑块查看完整效果。</p>
      )}
    </div>
  )
}

export default function DeferredValueDemo() {
  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-2">React useDeferredValue Demo</h1>
      <p className="text-gray-500 mb-6">
        延迟更新某个值，让高优先级更新（如滑块拖拽）保持流畅
      </p>

      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded text-sm">
        <p className="font-semibold mb-1">操作说明：</p>
        <p>
          快速拖动两边的滑块。左侧直接渲染 100x100 色块网格（10000
          个元素），滑块卡顿明显；右侧使用 useDeferredValue
          延迟网格更新，滑块始终顺畅跟手，网格在空闲时才更新。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WithoutDeferred />
        <WithDeferred />
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded text-sm">
        <p className="font-semibold mb-1">useDeferredValue 要点:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>
            接受一个值，返回一个「延迟」版本，仅在浏览器空闲时更新
          </li>
          <li>
            旧值会被保留到新值渲染完成，期间可通过{' '}
            <code className="bg-gray-200 px-1 rounded">
              value !== deferredValue
            </code>{' '}
            判断是否过时
          </li>
          <li>
            适合无法控制状态更新来源的场景（外部状态、父组件传入的 props）
          </li>
          <li>
            配合{' '}
            <code className="bg-gray-200 px-1 rounded">useMemo</code>
            避免不必要的重复计算
          </li>
          <li>
            与{' '}
            <code className="bg-gray-200 px-1 rounded">
              useTransition
            </code>{' '}
            不同：它不改变更新方式，而是延迟消费值的结果
          </li>
        </ul>
      </div>
    </div>
  )
}
