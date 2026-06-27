import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import Sidebar from './components/Sidebar'
import CrossLayerDemo from './pages/CrossLayerDemo'
import ZustandDemo from './pages/ZustandDemo'
import ReduxDemo from './pages/ReduxDemo'
import ImmerDemo from './pages/ImmerDemo'
import ExternalStoreDemo from './pages/ExternalStoreDemo'

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
        </Routes>
      </Content>
    </Layout>
  )
}

export default App
