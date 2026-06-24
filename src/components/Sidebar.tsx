import { useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu } from 'antd'

const { Sider } = Layout

const menuItems = [
  {
    key: '/',
    label: '跨层传递数据 Demo',
  },
  {
    key: '/zustand',
    label: 'Zustand 状态管理 Demo',
  },
  {
    key: '/redux',
    label: 'Redux 状态管理 Demo',
  },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Sider width={220} theme="dark">
      <div className="h-16 flex items-center justify-center text-white font-bold text-lg border-b border-white/10">
        Demo Frontend
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  )
}
