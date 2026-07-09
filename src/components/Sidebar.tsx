import { useLocation, Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible'

const menuGroups = [
  {
    label: '全局状态管理库',
    items: [
      { key: '/zustand', label: 'Zustand Demo' },
      { key: '/redux', label: 'Redux Demo' },
    ],
  },
  {
    label: 'React 原生 Hooks',
    items: [
      { key: '/immer', label: 'useImmer Demo' },
      { key: '/external-store', label: 'useSyncExternalStore Demo' },
      { key: '/transition', label: 'useTransition Demo' },
      { key: '/deferred-value', label: 'useDeferredValue Demo' },
      { key: '/use-effect', label: 'useEffect Demo' },
      { key: '/use-layout-effect', label: 'useLayoutEffect Demo' },
      { key: '/use-ref', label: 'useRef Demo' },
      { key: '/use-imperative-handle', label: 'useImperativeHandle Demo' },
      { key: '/memo', label: 'useMemo & React.memo Demo' },
      { key: '/use-callback', label: 'useCallback Demo' },
      { key: '/use-debug-value', label: 'useDebugValue Demo' },
      { key: '/suspense', label: 'Suspense 骨架屏 Demo' },
      { key: '/create-portal', label: 'createPortal Demo' },
    ],
  },
  {
    label: '设计模式',
    items: [
      { key: '/hoc', label: 'HOC 高阶组件 Demo' },
    ],
  },
  {
    label: '跨层通信',
    items: [
      { key: '/', label: '跨层传递数据 Demo' },
    ],
  },
]

export default function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex h-14 items-center justify-center border-b border-sidebar-border">
          <span className="font-semibold text-lg text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            Demo Frontend
          </span>
          <span className="font-semibold text-lg text-sidebar-foreground hidden group-data-[collapsible=icon]:inline">
            DF
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {menuGroups.map((group) => (
          <Collapsible
            key={group.label}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger>
                  {group.label}
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.key}>
                        <SidebarMenuButton
                          asChild
                          isActive={location.pathname === item.key}
                          tooltip={item.label}
                        >
                          <Link to={item.key}>
                            {item.label}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
