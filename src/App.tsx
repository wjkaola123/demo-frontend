import { Routes, Route } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import AppSidebar from './components/Sidebar'
import ThemeToggle from './components/ThemeToggle'
import CrossLayerDemo from './pages/CrossLayerDemo'
import ZustandDemo from './pages/ZustandDemo'
import ReduxDemo from './pages/ReduxDemo'
import ImmerDemo from './pages/ImmerDemo'
import ExternalStoreDemo from './pages/ExternalStoreDemo'
import TransitionDemo from './pages/TransitionDemo'
import DeferredValueDemo from './pages/DeferredValueDemo'
import UseEffectDemo from './pages/UseEffectDemo'
import UseLayoutEffectDemo from './pages/UseLayoutEffectDemo'
import UseRefDemo from './pages/UseRefDemo'
import UseImperativeHandleDemo from './pages/UseImperativeHandleDemo'
import MemoDemo from './pages/MemoDemo'
import UseCallbackDemo from './pages/UseCallbackDemo'
import UseDebugValueDemo from './pages/UseDebugValueDemo'
import SuspenseDemo from './pages/SuspenseDemo'
import HocDemo from './pages/HocDemo'
import CreatePortalDemo from './pages/CreatePortalDemo'

function App() {
  return (
    <SidebarProvider className="bg-muted/30">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-sm">
          <SidebarTrigger className="transition-all duration-200 hover:bg-accent hover:shadow-sm" />
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<CrossLayerDemo />} />
            <Route path="/zustand" element={<ZustandDemo />} />
            <Route path="/redux" element={<ReduxDemo />} />
            <Route path="/immer" element={<ImmerDemo />} />
            <Route path="/external-store" element={<ExternalStoreDemo />} />
            <Route path="/transition" element={<TransitionDemo />} />
            <Route path="/deferred-value" element={<DeferredValueDemo />} />
            <Route path="/use-effect" element={<UseEffectDemo />} />
            <Route path="/use-layout-effect" element={<UseLayoutEffectDemo />} />
            <Route path="/use-ref" element={<UseRefDemo />} />
            <Route path="/use-imperative-handle" element={<UseImperativeHandleDemo />} />
            <Route path="/memo" element={<MemoDemo />} />
            <Route path="/use-callback" element={<UseCallbackDemo />} />
            <Route path="/use-debug-value" element={<UseDebugValueDemo />} />
            <Route path="/suspense" element={<SuspenseDemo />} />
            <Route path="/hoc" element={<HocDemo />} />
            <Route path="/create-portal" element={<CreatePortalDemo />} />
          </Routes>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
