import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import Sidebar from './components/Sidebar'
import CrossLayerDemo from './pages/CrossLayerDemo'
import ZustandDemo from './pages/ZustandDemo'
import ReduxDemo from './pages/ReduxDemo'

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
        </Routes>
      </Content>
    </Layout>
  )
}

export default App
