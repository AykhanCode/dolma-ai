import { cn } from '@/utils/helpers'
import { useUiStore } from '@/store/uiStore'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isSidebarOpen } = useUiStore()

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <Sidebar />
      <main
        className={cn(
          'transition-all duration-300',
          'pt-0 min-h-[calc(100vh-4rem)]',
          // Desktop sidebar offset
          isSidebarOpen ? 'lg:ml-56' : 'lg:ml-16',
        )}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
