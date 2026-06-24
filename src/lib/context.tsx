import { createContext, useContext, useState, type ReactNode } from 'react'

interface AppState {
  message: string
  count: number
}

interface AppContextType {
  state: AppState
  setMessage: (msg: string) => void
  increment: () => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({ message: 'Hello from Context', count: 0 })

  const setMessage = (message: string) => setState(prev => ({ ...prev, message: message }))
  const increment = () => setState(prev => ({ ...prev, count: prev.count + 1 }))

  return (
    <AppContext.Provider value={{ state, setMessage, increment }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
