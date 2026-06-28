import { useState, type ReactNode } from 'react'
import { AppContext, type AppState } from './app-context'

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
