type Listener = () => void

interface Todo {
  id: number
  text: string
  done: boolean
}

interface Store {
  count: number
  todos: Todo[]
}

let store: Store = {
  count: 0,
  todos: [],
}

const listeners = new Set<Listener>()

function subscribe(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot(): Store {
  return store
}

function emit() {
  listeners.forEach(l => l())
}

function increment() {
  store = { ...store, count: store.count + 1 }
  emit()
}

function decrement() {
  store = { ...store, count: store.count - 1 }
  emit()
}

function reset() {
  store = { ...store, count: 0 }
  emit()
}

function addTodo(text: string) {
  const todo: Todo = { id: Date.now(), text, done: false }
  store = { ...store, todos: [...store.todos, todo] }
  emit()
}

function toggleTodo(id: number) {
  store = {
    ...store,
    todos: store.todos.map(t => (t.id === id ? { ...t, done: !t.done } : t)),
  }
  emit()
}

function removeTodo(id: number) {
  store = { ...store, todos: store.todos.filter(t => t.id !== id) }
  emit()
}

const LS_KEY = 'demo-sync-note'

const lsListeners = new Set<Listener>()

function subscribeLS(listener: Listener) {
  lsListeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key === LS_KEY) {
      lsListeners.forEach(l => l())
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    lsListeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

function getLSSnapshot(): string {
  return localStorage.getItem(LS_KEY) ?? ''
}

function setLSItem(value: string) {
  localStorage.setItem(LS_KEY, value)
  lsListeners.forEach(l => l())
}

export {
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
}
export type { Store, Todo }
