import { create } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

export const useCounterStore = create<CounterState>(set => ({
  count: 0,
  increment: () => set(prev => ({ count: prev.count + 1 })),
  decrement: () => set(prev => ({ count: prev.count - 1 })),
  reset: () => set({ count: 0 }),
}))

interface Todo {
  id: number
  text: string
  done: boolean
}

interface TodoState {
  todos: Todo[]
  addTodo: (text: string) => void
  toggleTodo: (id: number) => void
  removeTodo: (id: number) => void
}

let nextId = 1

export const useTodoStore = create<TodoState>(set => ({
  todos: [],
  addTodo: (text) =>
    set(prev => ({ todos: [...prev.todos, { id: nextId++, text, done: false }] })),
  toggleTodo: (id) =>
    set(prev => ({
      todos: prev.todos.map(t => (t.id === id ? { ...t, done: !t.done } : t)),
    })),
  removeTodo: (id) =>
    set(prev => ({ todos: prev.todos.filter(t => t.id !== id) })),
}))
