import { Link, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, Menu, Moon, Search, Sun } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useBusinessStore } from '@/store/businessStore'
import { useUiStore } from '@/store/uiStore'
import { getInitials, getAvatarColor, getDisplayName } from '@/utils/helpers'

export function Header() {
  const { user, logout } = useAuthStore()
  const { businesses, currentBusiness, selectBusiness } = useBusinessStore()
  const { toggleSidebar, toggleDarkMode, isDarkMode } = useUiStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center px-4 gap-4 sticky top-0 z-40">
      {/* Sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Logo */}
      <Link to="/dashboard" className="flex items-center gap-2 mr-4">
        <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">D</span>
        </div>
        <span className="font-bold text-neutral-900 hidden sm:block">DOLMA AI</span>
      </Link>

      {/* Business selector */}
      {businesses.length > 0 && (
        <div className="relative group">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-primary-300 transition-colors text-sm">
            <span className="max-w-32 truncate font-medium text-neutral-700">
              {currentBusiness?.name || 'Select Business'}
            </span>
            <ChevronDown className="w-4 h-4 text-neutral-400" />
          </button>
          <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-neutral-200 py-1 hidden group-hover:block z-50">
            {businesses.map((biz) => (
              <button
                key={biz.id}
                onClick={() => selectBusiness(biz)}
                className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-primary-light hover:text-primary-700 transition-colors"
              >
                {biz.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded-lg w-60">
        <Search className="w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-sm text-neutral-700 placeholder-neutral-400 outline-none flex-1"
        />
      </div>

      {/* Dark mode toggle */}
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Notifications */}
      <button className="relative p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors" aria-label="Notifications">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      {/* User profile */}
      {user && (
        <div className="relative group">
          <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-neutral-100 transition-colors">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getAvatarColor(`${user.firstName ?? ''}${user.lastName ?? ''}`)}`}
            >
              {getInitials(getDisplayName(user) || user.email)}
            </div>
            <ChevronDown className="w-3 h-3 text-neutral-400 hidden sm:block" />
          </button>
          <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-1 hidden group-hover:block z-50">
            <div className="px-4 py-2 border-b border-neutral-100">
              <p className="text-sm font-medium text-neutral-900">{getDisplayName(user)}</p>
              <p className="text-xs text-neutral-500">{user.email}</p>
            </div>
            <Link to="/settings" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">Settings</Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
