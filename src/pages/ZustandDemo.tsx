import { useState } from 'react'
import { useCounterStore, useTodoStore } from '../lib/zustand-store'

function CounterSection() {
  const count = useCounterStore(s => s.count)
  const increment = useCounterStore(s => s.increment)
  const decrement = useCounterStore(s => s.decrement)
  const reset = useCounterStore(s => s.reset)

  return (
    <div className="border-2 border-purple-400 rounded-lg p-4">
      <h2 className="font-bold text-lg mb-2">Counter</h2>
      <p className="text-3xl font-mono mb-3">{count}</p>
      <div className="flex gap-2">
        <button className="bg-purple-500 text-white px-4 py-1 rounded" onClick={increment}>+1</button>
        <button className="bg-purple-500 text-white px-4 py-1 rounded" onClick={decrement}>-1</button>
        <button className="bg-gray-400 text-white px-4 py-1 rounded" onClick={reset}>Reset</button>
      </div>
    </div>
  )
}

function TodoSection() {
  const [input, setInput] = useState('')
  const todos = useTodoStore(s => s.todos)
  const addTodo = useTodoStore(s => s.addTodo)
  const toggleTodo = useTodoStore(s => s.toggleTodo)
  const removeTodo = useTodoStore(s => s.removeTodo)

  const handleAdd = () => {
    if (!input.trim()) return
    addTodo(input.trim())
    setInput('')
  }

  return (
    <div className="border-2 border-pink-400 rounded-lg p-4">
      <h2 className="font-bold text-lg mb-2">Todo List</h2>
      <div className="flex gap-2 mb-3">
        <input
          className="border rounded px-2 py-1 flex-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Add a todo..."
        />
        <button className="bg-pink-500 text-white px-3 py-1 rounded" onClick={handleAdd}>Add</button>
      </div>
      <ul className="space-y-1">
        {todos.map(t => (
          <li key={t.id} className="flex items-center gap-2">
            <input type="checkbox" checked={t.done} onChange={() => toggleTodo(t.id)} />
            <span className={t.done ? 'line-through text-gray-400' : ''}>{t.text}</span>
            <button className="ml-auto text-red-500 text-sm" onClick={() => removeTodo(t.id)}>Del</button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && <p className="text-gray-400 text-sm">No todos yet</p>}
    </div>
  )
}

export default function ZustandDemo() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Zustand 状态管理 Demo</h1>
      <p className="text-gray-500 mb-4">
        两个独立 store，展示 Zustand 的简洁性和灵活性
      </p>
      <div className="flex flex-col gap-4">
        <CounterSection />
        <TodoSection />
      </div>
      <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
        <p className="font-semibold mb-1">Zustand 特点:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>无需 Provider 包裹，直接在任何组件中使用</li>
          <li>支持选择器（selector），精准订阅避免不必要渲染</li>
          <li>API 简洁，TypeScript 类型推导完善</li>
        </ul>
      </div>
    </div>
  )
}
