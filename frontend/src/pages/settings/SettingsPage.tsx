import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardTitle } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { useAuthStore } from '@/store/authStore'
import { getDisplayName } from '@/utils/helpers'
import { Bell, Lock, Palette, Shield } from 'lucide-react'

export function SettingsPage() {
  const { user } = useAuthStore()

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-sm text-neutral-500 mt-1">Manage your account preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <Card variant="elevated" padding="md">
          <CardTitle className="mb-5">Profile Information</CardTitle>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {user?.firstName?.[0] || 'U'}
            </div>
            <div>
              <p className="font-semibold text-neutral-900">{user ? getDisplayName(user) : ''}</p>
              <p className="text-sm text-neutral-500">{user?.email}</p>
              <span className="text-xs bg-primary-light text-primary-700 px-2 py-0.5 rounded-full capitalize mt-1 inline-block">
                {user?.role}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="First name" defaultValue={user?.firstName} />
            <Input label="Last name" defaultValue={user?.lastName} />
          </div>
          <div className="mt-4">
            <Input label="Email" type="email" defaultValue={user?.email} />
          </div>
          <Button className="mt-4">Save Changes</Button>
        </Card>

        {/* Security */}
        <Card variant="elevated" padding="md">
          <div className="flex items-center gap-3 mb-5">
            <Lock className="w-5 h-5 text-neutral-600" />
            <CardTitle>Security</CardTitle>
          </div>
          <div className="space-y-4">
            <Input label="Current password" type="password" placeholder="••••••••" />
            <Input label="New password" type="password" placeholder="Min 8 characters" />
            <Input label="Confirm new password" type="password" placeholder="Repeat new password" />
            <Button>Update Password</Button>
          </div>
        </Card>

        {/* Notifications */}
        <Card variant="elevated" padding="md">
          <div className="flex items-center gap-3 mb-5">
            <Bell className="w-5 h-5 text-neutral-600" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <div className="space-y-4">
            {[
              { label: 'New conversation', description: 'Get notified when a new conversation starts' },
              { label: 'Escalation alerts', description: 'Get notified when a conversation is escalated' },
              { label: 'Weekly reports', description: 'Receive weekly analytics summaries' },
              { label: 'Agent deployment', description: 'Get notified when agents are deployed' },
            ].map(({ label, description }) => (
              <div key={label} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-neutral-800">{label}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{description}</p>
                </div>
                <button
                  className="relative w-10 h-5 bg-primary-500 rounded-full transition-colors"
                  role="switch"
                  aria-checked="true"
                >
                  <span className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Appearance */}
        <Card variant="elevated" padding="md">
          <div className="flex items-center gap-3 mb-5">
            <Palette className="w-5 h-5 text-neutral-600" />
            <CardTitle>Appearance</CardTitle>
          </div>
          <div className="flex gap-3">
            {['Light', 'Dark', 'System'].map((mode) => (
              <button
                key={mode}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  mode === 'Light'
                    ? 'border-primary-500 bg-primary-light text-primary-700'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </Card>

        {/* Danger zone */}
        <Card variant="bordered" padding="md">
          <div className="flex items-center gap-3 mb-5">
            <Shield className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
          </div>
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
            <div>
              <p className="text-sm font-medium text-red-800">Delete Account</p>
              <p className="text-xs text-red-600 mt-0.5">Permanently delete your account and all data</p>
            </div>
            <Button variant="danger" size="sm">Delete Account</Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
