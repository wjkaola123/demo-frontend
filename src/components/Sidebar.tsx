import { useLocation, Link } from 'react-router-dom'
import {
  ChevronDown,
  Database,
  Code2,
  Shapes,
  Network,
  Layers,
  Store,
  GitBranch,
  HardDrive,
  Zap,
  Clock,
  RefreshCw,
  Layout,
  Link2,
  ArrowUpRight,
  Copy,
  Repeat,
  Bug,
  Loader,
  ExternalLink,
  Puzzle,
  Share2,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
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
  SidebarFooter,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

interface MenuItem {
  key: string
  label: string
  icon: LucideIcon
}

interface MenuGroup {
  label: string
  icon: LucideIcon
  items: MenuItem[]
}

const menuGroups: MenuGroup[] = [
  {
    label: '全局状态管理库',
    icon: Database,
    items: [
      { key: '/zustand', label: 'Zustand Demo', icon: Layers },
      { key: '/redux', label: 'Redux Demo', icon: Store },
    ],
  },
  {
    label: 'React 原生 Hooks',
    icon: Code2,
    items: [
      { key: '/immer', label: 'useImmer Demo', icon: GitBranch },
      { key: '/external-store', label: 'useSyncExternalStore Demo', icon: HardDrive },
      { key: '/transition', label: 'useTransition Demo', icon: Zap },
      { key: '/deferred-value', label: 'useDeferredValue Demo', icon: Clock },
      { key: '/use-effect', label: 'useEffect Demo', icon: RefreshCw },
      { key: '/use-layout-effect', label: 'useLayoutEffect Demo', icon: Layout },
      { key: '/use-ref', label: 'useRef Demo', icon: Link2 },
      { key: '/use-imperative-handle', label: 'useImperativeHandle Demo', icon: ArrowUpRight },
      { key: '/memo', label: 'useMemo & React.memo Demo', icon: Copy },
      { key: '/use-callback', label: 'useCallback Demo', icon: Repeat },
      { key: '/use-debug-value', label: 'useDebugValue Demo', icon: Bug },
      { key: '/suspense', label: 'Suspense 骨架屏 Demo', icon: Loader },
      { key: '/create-portal', label: 'createPortal Demo', icon: ExternalLink },
      { key: '/router-demo', label: 'React Router Demo', icon: ExternalLink },
    ],
  },
  {
    label: '设计模式',
    icon: Shapes,
    items: [
      { key: '/hoc', label: 'HOC 高阶组件 Demo', icon: Puzzle },
    ],
  },
  {
    label: '跨层通信',
    icon: Network,
    items: [
      { key: '/', label: '跨层传递数据 Demo', icon: Share2 },
    ],
  },
]

export default function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar collapsible="icon" variant="floating" className="border-sidebar-border/60">
      <SidebarHeader className="p-3">
        <div className="flex h-12 items-center gap-3 rounded-xl bg-linear-to-br from-sidebar-primary/15 via-sidebar-accent/40 to-sidebar-primary/5 px-3 ring-1 ring-sidebar-border/80 transition-all duration-300 hover:from-sidebar-primary/20 hover:shadow-md hover:shadow-sidebar-primary/10 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:ring-0">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm shadow-sidebar-primary/30 transition-transform duration-200 group-data-[collapsible=icon]:size-7">
            <Sparkles className="size-4" />
          </div>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold tracking-tight text-sidebar-foreground">
              Demo Frontend
            </p>
            <p className="truncate text-[11px] text-sidebar-foreground/55">
              React 状态 & Hooks 演示
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-1 px-1 pb-2">
        {menuGroups.map((group) => {
          const GroupIcon = group.icon
          return (
            <Collapsible
              key={group.label}
              defaultOpen
              className="group/collapsible"
            >
              <SidebarGroup className="py-1">
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="sidebar-group-trigger w-full">
                    <GroupIcon data-group-icon className="size-3.5 shrink-0 transition-all duration-200" />
                    <span className="truncate">{group.label}</span>
                    <ChevronDown className="ml-auto size-3.5 shrink-0 opacity-50 transition-all duration-200 group-data-[state=open]/collapsible:rotate-180 group-data-[state=open]/collapsible:opacity-100" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
                  <SidebarGroupContent className="pt-0.5">
                    <SidebarMenu className="gap-0.5">
                      {group.items.map((item) => {
                        const ItemIcon = item.icon
                        const isActive = location.pathname === item.key
                        return (
                          <SidebarMenuItem key={item.key}>
                            <SidebarMenuButton
                              asChild
                              isActive={isActive}
                              tooltip={item.label}
                              className={cn(
                                'sidebar-nav-item h-9 gap-2.5 rounded-lg px-2.5',
                                'text-sidebar-foreground/80',
                                'hover:text-sidebar-accent-foreground',
                              )}
                            >
                              <Link to={item.key}>
                                <ItemIcon
                                  data-sidebar-icon
                                  className="size-4 shrink-0 transition-all duration-200"
                                />
                                <span className="truncate">{item.label}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          )
        })}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/60 p-3">
        <div className="rounded-lg bg-sidebar-accent/50 px-3 py-2 text-center ring-1 ring-sidebar-border/50 transition-all duration-200 hover:bg-sidebar-accent hover:shadow-sm group-data-[collapsible=icon]:hidden">
          <p className="text-[11px] font-medium text-sidebar-foreground/70">
            17 个交互式 Demo
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
