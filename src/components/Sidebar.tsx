import { useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu } from 'antd'

const { Sider } = Layout

const menuItems = [
  {
    key: 'group-libs',
    type: 'group' as const,
    label: '全局状态管理库',
    children: [
      { key: '/zustand', label: 'Zustand Demo' },
      { key: '/redux', label: 'Redux Demo' },
    ],
  },
  {
    key: 'group-react',
    type: 'group' as const,
    label: 'React 原生 Hooks',
    children: [
      { key: '/immer', label: 'useImmer Demo' },
      { key: '/external-store', label: 'useSyncExternalStore Demo' },
      { key: '/transition', label: 'useTransition Demo' },
      { key: '/deferred-value', label: 'useDeferredValue Demo' },
      { key: '/use-effect', label: 'useEffect Demo' },
      { key: '/use-layout-effect', label: 'useLayoutEffect Demo' },
      { key: '/use-ref', label: 'useRef Demo' },
      { key: '/use-imperative-handle', label: 'useImperativeHandle Demo' },
    ],
  },
  {
    key: 'group-cross',
    type: 'group' as const,
    label: '跨层通信',
    children: [
      { key: '/', label: '跨层传递数据 Demo' },
    ],
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
