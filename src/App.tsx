import { Routes, Route } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import AppSidebar from './components/Sidebar'
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

function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
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
          </Routes>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
