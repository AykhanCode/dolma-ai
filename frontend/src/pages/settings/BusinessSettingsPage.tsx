import { useState } from 'react'
import { Building2, Edit, Plus, Trash2, Upload } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardTitle } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Modal } from '@/components/common/Modal'
import { CreateBusinessForm } from '@/components/forms/CreateBusinessForm'
import { useBusinessStore } from '@/store/businessStore'
import toast from 'react-hot-toast'

export function BusinessSettingsPage() {
  const { businesses, currentBusiness, deleteBusiness } = useBusinessStore()
  const [showCreate, setShowCreate] = useState(false)

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Business Settings</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage your businesses</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>
          Add Business
        </Button>
      </div>

      <div className="max-w-3xl space-y-6">
        {businesses.map((business) => (
          <Card key={business.id} variant="elevated" padding="md">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{business.name}</h3>
                  {business.industry && <p className="text-sm text-neutral-500">{business.industry}</p>}
                  {currentBusiness?.id === business.id && (
                    <span className="text-xs text-primary-600 font-medium">Current</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" icon={<Edit className="w-4 h-4" />}>Edit</Button>
                <button
                  onClick={async () => {
                    if (!confirm('Delete this business?')) return
                    try {
                      await deleteBusiness(business.id)
                      toast.success('Business deleted')
                    } catch {
                      toast.error('Failed to delete business')
                    }
                  }}
                  className="p-2 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Website" defaultValue={business.website || ''} />
              <Input label="Phone" defaultValue={business.phone || ''} />
              <Input label="Email" type="email" defaultValue={business.email || ''} />
            </div>

            {/* Upload section */}
            <div className="mt-4 p-4 border-2 border-dashed border-neutral-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Upload className="w-5 h-5 text-neutral-400" />
                <div>
                  <p className="text-sm font-medium text-neutral-700">Upload business documents</p>
                  <p className="text-xs text-neutral-500">PDF, Word files to train your AI agents</p>
                </div>
                <Button variant="secondary" size="sm" className="ml-auto">Upload</Button>
              </div>
            </div>
          </Card>
        ))}

        {businesses.length === 0 && (
          <Card variant="bordered" padding="lg" className="text-center">
            <Building2 className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500 mb-4">No businesses yet</p>
            <Button onClick={() => setShowCreate(true)} icon={<Plus className="w-4 h-4" />}>
              Add your first business
            </Button>
          </Card>
        )}
      </div>

      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Add Business"
        size="lg"
      >
        <CreateBusinessForm
          onSuccess={() => setShowCreate(false)}
          onCancel={() => setShowCreate(false)}
        />
      </Modal>
    </DashboardLayout>
  )
}
