import { useState } from 'react'
import { Mail, Plus, Shield, Trash2 } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardTitle } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { Modal } from '@/components/common/Modal'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { USER_ROLES } from '@/utils/constants'
import { getInitials, getAvatarColor } from '@/utils/helpers'

const MOCK_MEMBERS = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'manager' },
  { id: '3', name: 'Carol Davis', email: 'carol@example.com', role: 'agent' },
]

export function TeamSettingsPage() {
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('agent')

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Team Members</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage your team access</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowInvite(true)}>
          Invite Member
        </Button>
      </div>

      <div className="max-w-3xl">
        <Card variant="elevated" padding="none">
          <div className="divide-y divide-neutral-100">
            {MOCK_MEMBERS.map((member) => (
              <div key={member.id} className="flex items-center gap-4 p-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getAvatarColor(member.name)}`}
                >
                  {getInitials(member.name)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">{member.name}</p>
                  <p className="text-sm text-neutral-500">{member.email}</p>
                </div>
                <Badge variant={member.role === 'admin' ? 'default' : 'neutral'} className="capitalize">
                  {member.role}
                </Badge>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100">
                    <Shield className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal
        isOpen={showInvite}
        onClose={() => setShowInvite(false)}
        title="Invite Team Member"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowInvite(false)}>Cancel</Button>
            <Button onClick={() => setShowInvite(false)} icon={<Mail className="w-4 h-4" />}>
              Send Invitation
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Email address"
            type="email"
            placeholder="colleague@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <Select
            label="Role"
            options={USER_ROLES}
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
          />
          <div className="bg-primary-light rounded-lg p-3 text-sm text-primary-700">
            They'll receive an email invitation to join your team.
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
