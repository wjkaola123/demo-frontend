import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../lib/redux-store'
import { increment, decrement, reset, addByAmount, addTodo, toggleTodo, removeTodo } from '../lib/redux-store'

function CounterSection() {
  const value = useSelector((s: RootState) => s.counter.value)
  const dispatch = useDispatch<AppDispatch>()

  return (
    <div className="border-2 border-blue-500 rounded-lg p-4">
      <h2 className="font-bold text-lg mb-2">Counter</h2>
      <p className="text-3xl font-mono mb-3">{value}</p>
      <div className="flex gap-2 flex-wrap">
        <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={() => dispatch(increment())}>+1</button>
        <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={() => dispatch(decrement())}>-1</button>
        <button className="bg-secondary text-secondary-foreground px-4 py-1 rounded" onClick={() => dispatch(reset())}>Reset</button>
        <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={() => dispatch(addByAmount(5))}>+5</button>
      </div>
    </div>
  )
}

function TodoSection() {
  const [input, setInput] = useState('')
  const list = useSelector((s: RootState) => s.todo.list)
  const dispatch = useDispatch<AppDispatch>()

  const handleAdd = () => {
    if (!input.trim()) return
    dispatch(addTodo(input.trim()))
    setInput('')
  }

  return (
    <div className="border-2 border-green-500 rounded-lg p-4">
      <h2 className="font-bold text-lg mb-2">Todo List</h2>
      <div className="flex gap-2 mb-3">
        <input
          className="border rounded px-2 py-1 flex-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Add a todo..."
        />
        <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={handleAdd}>Add</button>
      </div>
      <ul className="space-y-1">
        {list.map(t => (
          <li key={t.id} className="flex items-center gap-2">
            <input type="checkbox" checked={t.done} onChange={() => dispatch(toggleTodo(t.id))} />
            <span className={t.done ? 'line-through text-muted-foreground' : ''}>{t.text}</span>
            <button className="ml-auto text-red-500 text-sm" onClick={() => dispatch(removeTodo(t.id))}>Del</button>
          </li>
        ))}
      </ul>
      {list.length === 0 && <p className="text-muted-foreground text-sm">No todos yet</p>}
    </div>
  )
}

export default function ReduxDemo() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Redux 状态管理 Demo</h1>
      <p className="text-muted-foreground mb-4">
        使用 Redux Toolkit 实现，展示 createSlice、configureStore、useSelector、useDispatch
      </p>
      <div className="flex flex-col gap-4">
        <CounterSection />
        <TodoSection />
      </div>
      <div className="mt-4 p-4 bg-muted rounded text-sm">
        <p className="font-semibold mb-1">Redux 特点:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>单一 Store，通过 reducer 组合管理状态</li>
          <li>Action 分发 → Reducer 更新 → 组件重渲染，单向数据流</li>
          <li>Redux Toolkit 内置 Immer，reducer 中可直接"修改" state</li>
          <li>需要 Provider 包裹根组件，通过 useSelector 订阅</li>
        </ul>
      </div>
    </div>
  )
}
