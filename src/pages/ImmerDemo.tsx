import { useState } from 'react'
import { useImmer } from 'use-immer'

interface Todo {
  id: number
  text: string
  done: boolean
}

interface Profile {
  name: string
  email: string
  address: {
    city: string
    zip: string
  }
  hobbies: string[]
}

function ProfileSection() {
  const [profile, updateProfile] = useImmer<Profile>({
    name: '张三',
    email: 'zhangsan@example.com',
    address: { city: '北京', zip: '100000' },
    hobbies: ['编程', '阅读'],
  })

  return (
    <div className="border-2 border-teal-400 rounded-lg p-4">
      <h2 className="font-bold text-lg mb-2">Profile（嵌套对象）</h2>
      <div className="space-y-2 mb-3">
        <div>
          <label className="text-sm text-muted-foreground">姓名</label>
          <input
            className="border rounded px-2 py-1 w-full"
            value={profile.name}
            onChange={e => updateProfile(draft => { draft.name = e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">邮箱</label>
          <input
            className="border rounded px-2 py-1 w-full"
            value={profile.email}
            onChange={e => updateProfile(draft => { draft.email = e.target.value })}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-sm text-muted-foreground">城市</label>
            <input
              className="border rounded px-2 py-1 w-full"
              value={profile.address.city}
              onChange={e => updateProfile(draft => { draft.address.city = e.target.value })}
            />
          </div>
          <div className="w-28">
            <label className="text-sm text-muted-foreground">邮编</label>
            <input
              className="border rounded px-2 py-1 w-full"
              value={profile.address.zip}
              onChange={e => updateProfile(draft => { draft.address.zip = e.target.value })}
            />
          </div>
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-1">爱好</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {profile.hobbies.map((h, i) => (
              <span key={i} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-sm flex items-center gap-1">
              {h}
              <button
                className="text-teal-600 hover:text-red-500 text-xs leading-none"
                onClick={() => updateProfile(draft => { draft.hobbies.splice(i, 1) })}
              >
                x
              </button>
            </span>
          ))}
        </div>
        <button
          className="bg-teal-500 text-white px-3 py-1 rounded text-sm"
          onClick={() => updateProfile(draft => { draft.hobbies.push('新爱好') })}
        >
          + 添加爱好
        </button>
      </div>
      <details className="mt-3">
        <summary className="text-xs text-muted-foreground cursor-pointer">查看当前 state</summary>
        <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">{JSON.stringify(profile, null, 2)}</pre>
      </details>
    </div>
  )
}

function TodoSection() {
  const [input, setInput] = useState('')
  const [todos, setTodos] = useImmer<Todo[]>([])

  const handleAdd = () => {
    if (!input.trim()) return
    setTodos(draft => {
      draft.push({ id: Date.now(), text: input.trim(), done: false })
    })
    setInput('')
  }

  return (
    <div className="border-2 border-cyan-500 rounded-lg p-4">
      <h2 className="font-bold text-lg mb-2">Todo List（数组操作）</h2>
      <div className="flex gap-2 mb-3">
        <input
          className="border rounded px-2 py-1 flex-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Add a todo..."
        />
        <button className="bg-cyan-500 text-white px-3 py-1 rounded" onClick={handleAdd}>Add</button>
      </div>
      <ul className="space-y-1">
        {todos.map(t => (
          <li key={t.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => setTodos(draft => {
                const todo = draft.find(x => x.id === t.id)
                if (todo) todo.done = !todo.done
              })}
            />
            <span className={t.done ? 'line-through text-muted-foreground' : ''}>{t.text}</span>
            <button
              className="ml-auto text-red-500 text-sm"
              onClick={() => setTodos(draft => {
                const idx = draft.findIndex(x => x.id === t.id)
                if (idx !== -1) draft.splice(idx, 1)
              })}
            >Del</button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && <p className="text-muted-foreground text-sm">No todos yet</p>}
    </div>
  )
}

export default function ImmerDemo() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Immer useImmer Demo</h1>
      <p className="text-muted-foreground mb-4">
        通过 useImmer 以可变语法操作不可变状态，告别深拷贝和冗长的 spread
      </p>
      <div className="flex flex-col gap-4">
        <ProfileSection />
        <TodoSection />
      </div>
      <div className="mt-4 p-4 bg-muted rounded text-sm">
        <p className="font-semibold mb-1">Immer 特点:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>在 draft 上直接使用可变语法（赋值、push、splice 等）</li>
          <li>自动生成不可变（immutable）的下一状态</li>
          <li>天然支持嵌套对象更新，无需手动展开每一层</li>
          <li>useImmer 是 React 版的 Immer Hook，替代 useState + produce</li>
        </ul>
      </div>
    </div>
  )
}
