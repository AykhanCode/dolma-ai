import { NavLink } from 'react-router-dom'
import {
  BarChart2,
  Bot,
  Home,
  LayoutGrid,
  MessageSquare,
  Settings,
  Users,
  X,
} from 'lucide-react'
import { cn } from '@/utils/helpers'
import { useUiStore } from '@/store/uiStore'

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/agents', icon: Bot, label: 'Agents' },
  { to: '/chat', icon: MessageSquare, label: 'Chat Dashboard' },
  { to: '/content', icon: LayoutGrid, label: 'Content Manager' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/settings/team', icon: Users, label: 'Team' },
]

export function Sidebar() {
  const { isSidebarOpen, isMobileMenuOpen, toggleMobileMenu } = useUiStore()

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 bottom-0 z-40 bg-white border-r border-neutral-200',
          'transition-transform duration-300 overflow-y-auto',
          // Desktop
          'hidden lg:flex lg:flex-col',
          isSidebarOpen ? 'lg:w-56' : 'lg:w-16',
          // Mobile
          'flex flex-col w-64',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-4 lg:hidden border-b border-neutral-100">
          <span className="font-semibold text-neutral-900">Menu</span>
          <button
            onClick={toggleMobileMenu}
            className="p-1 rounded-lg hover:bg-neutral-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-2">
          <ul className="space-y-1" role="list">
            {navItems.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
                      isActive
                        ? 'bg-primary-light text-primary-700'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
                    )
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  {(isSidebarOpen || isMobileMenuOpen) && (
                    <span className={cn('truncate', !isSidebarOpen && 'lg:hidden')}>{label}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className={cn('p-4 border-t border-neutral-100 text-xs text-neutral-400', !isSidebarOpen && 'lg:hidden')}>
          DOLMA AI v1.0
        </div>
      </aside>
    </>
  )
}
