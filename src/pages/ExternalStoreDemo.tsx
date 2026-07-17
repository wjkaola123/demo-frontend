import { useSyncExternalStore, useState } from 'react'
import {
  subscribe,
  getSnapshot,
  increment,
  decrement,
  reset,
  addTodo,
  toggleTodo,
  removeTodo,
  subscribeLS,
  getLSSnapshot,
  setLSItem,
} from '../lib/external-store'

function CounterSection() {
  const { count } = useSyncExternalStore(subscribe, getSnapshot)

  return (
    <div className="border-2 border-cyan-400 rounded-lg p-4">
      <h2 className="font-bold text-lg mb-2">Counter</h2>
      <p className="text-3xl font-mono mb-3">{count}</p>
      <div className="flex gap-2">
        <button className="bg-cyan-500 text-white px-4 py-1 rounded" onClick={increment}>+1</button>
        <button className="bg-cyan-500 text-white px-4 py-1 rounded" onClick={decrement}>-1</button>
        <button className="bg-secondary text-secondary-foreground px-4 py-1 rounded" onClick={reset}>Reset</button>
      </div>
    </div>
  )
}

function TodoSection() {
  const [input, setInput] = useState('')
  const { todos } = useSyncExternalStore(subscribe, getSnapshot)

  const handleAdd = () => {
    if (!input.trim()) return
    addTodo(input.trim())
    setInput('')
  }

  return (
    <div className="border-2 border-teal-400 rounded-lg p-4">
      <h2 className="font-bold text-lg mb-2">Todo List</h2>
      <div className="flex gap-2 mb-3">
        <input
          className="border rounded px-2 py-1 flex-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Add a todo..."
        />
        <button className="bg-teal-500 text-white px-3 py-1 rounded" onClick={handleAdd}>Add</button>
      </div>
      <ul className="space-y-1">
        {todos.map(t => (
          <li key={t.id} className="flex items-center gap-2">
            <input type="checkbox" checked={t.done} onChange={() => toggleTodo(t.id)} />
            <span className={t.done ? 'line-through text-muted-foreground' : ''}>{t.text}</span>
            <button className="ml-auto text-red-500 text-sm" onClick={() => removeTodo(t.id)}>Del</button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && <p className="text-muted-foreground text-sm">No todos yet</p>}
    </div>
  )
}

function LocalStorageSection() {
  const value = useSyncExternalStore(subscribeLS, getLSSnapshot)
  const [input, setInput] = useState(value)

  const handleSave = () => {
    setLSItem(input)
  }

  const handleClear = () => {
    setInput('')
    setLSItem('')
  }

  return (
    <div className="border-2 border-orange-400 rounded-lg p-4">
      <h2 className="font-bold text-lg mb-2">localStorage 同步</h2>
      <p className="text-sm text-muted-foreground mb-3">
        当前值: <code className="bg-muted px-1 rounded">{value || '(空)'}</code>
      </p>
      <div className="flex gap-2">
        <input
          className="border rounded px-2 py-1 flex-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="输入内容，会同步到 localStorage..."
        />
        <button className="bg-orange-500 text-white px-3 py-1 rounded" onClick={handleSave}>保存</button>
        <button className="bg-secondary text-secondary-foreground px-3 py-1 rounded" onClick={handleClear}>清除</button>
      </div>
    </div>
  )
}

export default function ExternalStoreDemo() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">useSyncExternalStore Demo</h1>
      <p className="text-muted-foreground mb-4">
        使用 React 内置 Hook 订阅外部 store，零依赖
      </p>
      <div className="flex flex-col gap-4">
        <CounterSection />
        <TodoSection />
        <LocalStorageSection />
      </div>
      <div className="mt-4 p-4 bg-muted rounded text-sm">
        <p className="font-semibold mb-1">useSyncExternalStore 特点:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>React 内置 API，零外部依赖</li>
          <li>通过 subscribe + getSnapshot 桥接任何外部状态源</li>
          <li>自动处理并发更新和撕裂（tearing）问题</li>
          <li>常用于接入非 React 状态管理（Redux、Zustand 内部也用它）</li>
          <li>订阅 localStorage 变化，同标签页/跨标签页自动同步</li>
        </ul>
      </div>
    </div>
  )
}
