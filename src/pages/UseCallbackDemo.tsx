import { useState, useCallback, memo, useEffect, useRef } from 'react'

interface ItemProps {
  id: number
  label: string
  onRemove: (id: number) => void
}

const Item = memo(function Item({ id, label, onRemove }: ItemProps) {
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
    <div ref={ref} className="flex items-center justify-between px-3 py-2 border rounded bg-white">
      <span>{label}</span>
      <button
        className="px-2 py-0.5 text-xs bg-red-400 text-white rounded hover:bg-red-500 transition-colors"
        onClick={() => onRemove(id)}
      >
        删除
      </button>
    </div>
  )
})

const initialItems = [
  { id: 1, label: '商品 A' },
  { id: 2, label: '商品 B' },
  { id: 3, label: '商品 C' },
]

function WithUseCallback() {
  const [items, setItems] = useState(initialItems)
  const [count, setCount] = useState(0)

  const handleRemove = useCallback((id: number) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }, [])

  return (
    <div className="border-2 border-green-400 rounded-lg p-4 flex flex-col gap-3">
      <h2 className="font-bold text-lg text-green-700">使用 useCallback</h2>
      <p className="text-sm text-gray-500">
        <code className="bg-gray-200 px-1 rounded">handleRemove</code> 被 useCallback 缓存，引用不变，
        父组件 count 变化时子组件不重渲染。
      </p>
      <button
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors self-start"
        onClick={() => setCount(c => c + 1)}
      >
        触发父组件渲染 ({count})
      </button>
      <div className="flex flex-col gap-2">
        {items.map(item => (
          <Item key={item.id} id={item.id} label={item.label} onRemove={handleRemove} />
        ))}
      </div>
      {items.length === 0 && <p className="text-gray-400 text-sm">所有商品已删除</p>}
    </div>
  )
}

function WithoutUseCallback() {
  const [items, setItems] = useState(initialItems)
  const [count, setCount] = useState(0)

  const handleRemove = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className="border-2 border-red-400 rounded-lg p-4 flex flex-col gap-3">
      <h2 className="font-bold text-lg text-red-600">未使用 useCallback</h2>
      <p className="text-sm text-gray-500">
        每次渲染创建新的 <code className="bg-gray-200 px-1 rounded">handleRemove</code>，
        即使 props 没变，memo 包裹的子组件也会重渲染。
      </p>
      <button
        className="px-4 py-2 bg-red-400 text-white rounded hover:bg-red-500 transition-colors self-start"
        onClick={() => setCount(c => c + 1)}
      >
        触发父组件渲染 ({count})
      </button>
      <div className="flex flex-col gap-2">
        {items.map(item => (
          <Item key={item.id} id={item.id} label={item.label} onRemove={handleRemove} />
        ))}
      </div>
      {items.length === 0 && <p className="text-gray-400 text-sm">所有商品已删除</p>}
    </div>
  )
}

export default function UseCallbackDemo() {
  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-2">React useCallback Demo</h1>
      <p className="text-gray-500 mb-6">
        useCallback 缓存函数引用，防止 memo 子组件因父组件重渲染而收到新的函数 prop 导致无效重渲染
      </p>

      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded text-sm">
        <p className="font-semibold mb-1">操作说明：</p>
        <ul className="list-disc pl-4 space-y-0.5">
          <li>点击「触发父组件渲染」增加 count，这会触发父组件 state 更新</li>
          <li>右侧（未使用 useCallback）：函数引用每次变化，memo 子组件被红色闪烁标记（说明重渲染了）</li>
          <li>左侧（使用 useCallback）：函数引用不变，memo 子组件跳过重渲染，无闪烁</li>
          <li>点击「删除」按钮可验证功能正常</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WithUseCallback />
        <WithoutUseCallback />
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded text-sm">
        <p className="font-semibold mb-1">useCallback 要点:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>
            <code className="bg-gray-200 px-1 rounded">useCallback(fn, deps)</code> —
            仅当 deps 变化时返回新的函数引用，否则返回缓存的旧引用
          </li>
          <li>
            核心场景：将回调传给 <code className="bg-gray-200 px-1 rounded">memo()</code> 包裹的子组件，
            避免因函数引用变化导致的无效重渲染
          </li>
          <li>
            等价于 <code className="bg-gray-200 px-1 rounded">useMemo(() =&gt; fn, deps)</code>，
            useCallback 是专门缓存函数的语法糖
          </li>
          <li>deps 为空数组 `[]` 时函数只创建一次，内部引用的 state 永远是初始值（闭包陷阱）</li>
          <li>
            如函数内需读取最新 state，使用
            <code className="bg-gray-200 px-1 rounded">setState(prev =&gt; ...)</code> 函数式更新避免依赖过时值
          </li>
          <li>不要不加区分地对所有回调使用 useCallback — 仅在传给 memo 子组件或作为 effect 依赖时才有意义</li>
        </ul>
      </div>
    </div>
  )
}
