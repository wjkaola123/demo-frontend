import { createContext } from 'react'

export interface AppState {
  message: string
  count: number
}

export interface AppContextType {
  state: AppState
  setMessage: (msg: string) => void
  increment: () => void
}

export const AppContext = createContext<AppContextType | null>(null)
