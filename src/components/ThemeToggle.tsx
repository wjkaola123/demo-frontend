import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/lib/use-theme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleTheme}
      aria-label={isDark ? '切换到浅色主题' : '切换到暗色主题'}
      title={isDark ? '浅色模式' : '暗色模式'}
      className="transition-all duration-200 hover:bg-accent hover:shadow-sm"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}
