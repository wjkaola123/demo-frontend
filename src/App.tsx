import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import Sidebar from './components/Sidebar'
import CrossLayerDemo from './pages/CrossLayerDemo'

const { Content } = Layout

function App() {
  return (
    <Layout>
      <Sidebar />
      <Content>
        <Routes>
          <Route path="/" element={<CrossLayerDemo />} />
        </Routes>
      </Content>
    </Layout>
  )
}

export default App
