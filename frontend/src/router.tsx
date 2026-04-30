import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { LoginPage } from '@/pages/auth/LoginPage'
import { SignupPage } from '@/pages/auth/SignupPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { AgentsListPage } from '@/pages/agents/AgentsListPage'
import { CreateAgentPage } from '@/pages/agents/CreateAgentPage'
import { AgentDetailPage } from '@/pages/agents/AgentDetailPage'
import { ChatDashboardPage } from '@/pages/chat/ChatDashboardPage'
import { ContentManagerPage } from '@/pages/content/ContentManagerPage'
import { CreatePostPage } from '@/pages/content/CreatePostPage'
import { AnalyticsDashboardPage } from '@/pages/analytics/AnalyticsDashboardPage'
import { SettingsPage } from '@/pages/settings/SettingsPage'
import { BusinessSettingsPage } from '@/pages/settings/BusinessSettingsPage'
import { TeamSettingsPage } from '@/pages/settings/TeamSettingsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { useAuthStore } from '@/store/authStore'
import { useBusinessStore } from '@/store/businessStore'
import { FullPageSpinner } from '@/components/common/Spinner'

function ProtectedRoute() {
  const { isAuthenticated, accessToken, fetchCurrentUser, user, isLoading } = useAuthStore()
  const { fetchBusinesses } = useBusinessStore()

  useEffect(() => {
    if (accessToken && !user) {
      fetchCurrentUser()
    }
    if (isAuthenticated) {
      fetchBusinesses()
    }
  }, [isAuthenticated, accessToken])

  if (isLoading) return <FullPageSpinner />
  if (!isAuthenticated && !accessToken) return <Navigate to="/login" replace />

  return <Outlet />
}

function PublicRoute() {
  const { isAuthenticated } = useAuthStore()
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <Outlet />
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/agents" element={<AgentsListPage />} />
          <Route path="/agents/create" element={<CreateAgentPage />} />
          <Route path="/agents/:id" element={<AgentDetailPage />} />
          <Route path="/chat" element={<ChatDashboardPage />} />
          <Route path="/content" element={<ContentManagerPage />} />
          <Route path="/content/create" element={<CreatePostPage />} />
          <Route path="/analytics" element={<AnalyticsDashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/business" element={<BusinessSettingsPage />} />
          <Route path="/settings/team" element={<TeamSettingsPage />} />
        </Route>

        {/* Not found */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
