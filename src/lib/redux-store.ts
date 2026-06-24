import { createSlice, configureStore } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface CounterState {
  value: number
}

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 } as CounterState,
  reducers: {
    increment: (state) => { state.value += 1 },
    decrement: (state) => { state.value -= 1 },
    reset: (state) => { state.value = 0 },
    addByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
  },
})

interface Todo {
  id: number
  text: string
  done: boolean
}

interface TodoState {
  list: Todo[]
}

let nextId = 1

const todoSlice = createSlice({
  name: 'todo',
  initialState: { list: [] } as TodoState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.list.push({ id: nextId++, text: action.payload, done: false })
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.list.find(t => t.id === action.payload)
      if (todo) todo.done = !todo.done
    },
    removeTodo: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter(t => t.id !== action.payload)
    },
  },
})

export const { increment, decrement, reset, addByAmount } = counterSlice.actions
export const { addTodo, toggleTodo, removeTodo } = todoSlice.actions

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    todo: todoSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
