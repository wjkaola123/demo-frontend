import { useState, useMemo, memo, useEffect, useRef } from 'react'

// ====== React.memo 部分 ======

interface MemoItemProps {
  id: number
  name: string
  onToggle: (id: number) => void
  selected: boolean
}

const MemoItem = memo(function MemoItem({ id, name, onToggle, selected }: MemoItemProps) {
  return (
    <div
      className={`px-3 py-2 border-b cursor-pointer transition-colors ${
        selected ? 'bg-primary/10' : 'hover:bg-muted/50'
      }`}
      onClick={() => onToggle(id)}
    >
      <span>{name}</span>
    </div>
  )
})

const NonMemoItem = function NonMemoItem({ id, name, onToggle, selected }: MemoItemProps) {
  console.log(`[NonMemoItem] 渲染 item ${id}`)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    ref.current?.animate(
      [
        { backgroundColor: '#fecaca' },
        { backgroundColor: 'transparent' },
      ],
      { duration: 400, easing: 'ease-out' }
    )
  })
  return (
    <div
      ref={ref}
      className={`px-3 py-2 border-b cursor-pointer transition-colors ${
        selected ? 'bg-primary/10' : 'hover:bg-muted/50'
      }`}
      onClick={() => onToggle(id)}
    >
      <span>{name}</span>
    </div>
  )
}

const items = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `商品 ${String(i + 1).padStart(2, '0')}`,
}))

function ReactMemoSection() {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [count, setCount] = useState(0)

  return (
    <div className="border-2 border-purple-400 rounded-lg p-4 flex flex-col gap-3">
      <h2 className="font-bold text-lg">React.memo</h2>
      <p className="text-sm text-muted-foreground">
        memo 包裹组件后，props 不变则跳过重渲染。下方两个列表分别为使用/不使用 memo：
      </p>

      <div className="flex gap-4 items-center">
        <button
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          onClick={() => setCount(c => c + 1)}
        >
          点击 +1 (不影响 props): {count}
        </button>
        <span className="text-xs text-muted-foreground">
          选中项 ID: {selectedId ?? '-'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm font-semibold mb-1 text-green-600">使用 React.memo</div>
          <div className="border border-green-300 rounded max-h-[300px] overflow-y-auto">
            {items.map(item => (
              <MemoItem
                key={item.id}
                id={item.id}
                name={item.name}
                selected={selectedId === item.id}
                onToggle={setSelectedId}
              />
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold mb-1 text-red-500">未使用 memo</div>
          <div className="border border-red-300 rounded max-h-[300px] overflow-y-auto">
            {items.map(item => (
              <NonMemoItem
                key={item.id}
                id={item.id}
                name={item.name}
                selected={selectedId === item.id}
                onToggle={setSelectedId}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        点击上方按钮增加计数，观察右侧（无 memo）每项会闪烁红色（说明全部重渲染），
        左侧（有 memo）无变化——因为 props 未变，渲染被跳过。
      </p>
    </div>
  )
}

// ====== useMemo 部分 ======

function expensiveSum(n: number): number {
  console.log(`[useMemo] 执行计算 expensiveSum(${n})`)
  let sum = 0
  for (let i = 1; i <= n; i++) {
    sum += i
  }
  return sum
}

function UseMemoSection() {
  const [n, setN] = useState(5)
  const [count, setCount] = useState(0)

  const result = useMemo(() => expensiveSum(n), [n])

  return (
    <div className="border-2 border-indigo-400 rounded-lg p-4 flex flex-col gap-3">
      <h2 className="font-bold text-lg">useMemo</h2>
      <p className="text-sm text-muted-foreground">
        计算 1+2+...+N，结果被缓存。改 N 触发重算，点按钮只重渲染不重算。
      </p>

      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm whitespace-nowrap">N =</label>
          <input
            type="range"
            min={1}
            max={10}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-40"
          />
          <span className="text-sm font-mono">{n}</span>
        </div>
        <button
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
          onClick={() => setCount(c => c + 1)}
        >
          触发渲染 ({count})
        </button>
      </div>

      <div className="text-sm text-muted-foreground">
        计算结果: {result}
      </div>

      <p className="text-xs text-muted-foreground">
        拖动 slider 改变 N → 依赖变化，useMemo 重新执行计算。
        点击按钮增加 count → 依赖未变，useMemo 跳过计算直接返回缓存值。
      </p>
    </div>
  )
}

// ====== 主页面 ======

export default function MemoDemo() {
  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-2">useMemo 与 React.memo Demo</h1>
      <p className="text-muted-foreground mb-6">
        两者都用于性能优化 — useMemo 缓存计算结果，React.memo 缓存组件渲染
      </p>

      <div className="mb-6 p-4 bg-muted border border-border rounded text-sm">
        <p className="font-semibold mb-1">操作说明：</p>
        <ul className="list-disc pl-4 space-y-0.5">
          <li><strong>useMemo：</strong>拖动 slider 改变 threshold 会触发耗时计算；点击触发渲染按钮仅增加 tick，不重算</li>
          <li><strong>React.memo：</strong>点击上方按钮增加 count（父组件 state），观察左右两侧子组件是否重渲染</li>
        </ul>
      </div>

      <div className="flex flex-col gap-6">
        <ReactMemoSection />
        <UseMemoSection />
      </div>

      <div className="mt-6 p-4 bg-muted rounded text-sm">
        <p className="font-semibold mb-1">要点:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li><code className="bg-muted px-1 rounded">useMemo(fn, deps)</code> — 仅当 deps 变化时重新执行 fn，否则返回缓存值</li>
          <li><code className="bg-muted px-1 rounded">memo(Component)</code> — 仅当 props 变化时重渲染，否则复用上次结果</li>
          <li>useMemo 用于<strong>值</strong>（计算结果）缓存；React.memo 用于<strong>组件</strong>渲染缓存</li>
          <li>不要过度使用 — 仅在确有性能瓶颈时使用，memoization 本身也有开销</li>
          <li>React 19 中编译器（React Compiler）可自动插入 memo，开发者可逐步减少手写 memo</li>
        </ul>
      </div>
    </div>
  )
}
