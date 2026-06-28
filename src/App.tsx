import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import Sidebar from './components/Sidebar'
import CrossLayerDemo from './pages/CrossLayerDemo'
import ZustandDemo from './pages/ZustandDemo'
import ReduxDemo from './pages/ReduxDemo'
import ImmerDemo from './pages/ImmerDemo'
import ExternalStoreDemo from './pages/ExternalStoreDemo'
import TransitionDemo from './pages/TransitionDemo'
import DeferredValueDemo from './pages/DeferredValueDemo'
import UseEffectDemo from './pages/UseEffectDemo'

const { Content } = Layout

function App() {
  return (
    <Layout>
      <Sidebar />
      <Content>
        <Routes>
          <Route path="/" element={<CrossLayerDemo />} />
          <Route path="/zustand" element={<ZustandDemo />} />
          <Route path="/redux" element={<ReduxDemo />} />
          <Route path="/immer" element={<ImmerDemo />} />
          <Route path="/external-store" element={<ExternalStoreDemo />} />
          <Route path="/transition" element={<TransitionDemo />} />
          <Route path="/deferred-value" element={<DeferredValueDemo />} />
          <Route path="/use-effect" element={<UseEffectDemo />} />
        </Routes>
      </Content>
    </Layout>
  )
}

export default App
