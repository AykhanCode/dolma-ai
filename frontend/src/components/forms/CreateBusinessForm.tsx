import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building2, Globe, Mail, Phone } from 'lucide-react'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { createBusinessSchema, type CreateBusinessFormData } from '@/utils/validators'
import { useBusinessStore } from '@/store/businessStore'
import toast from 'react-hot-toast'

interface CreateBusinessFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function CreateBusinessForm({ onSuccess, onCancel }: CreateBusinessFormProps) {
  const { createBusiness } = useBusinessStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateBusinessFormData>({
    resolver: zodResolver(createBusinessSchema),
  })

  const onSubmit = async (data: CreateBusinessFormData) => {
    try {
      await createBusiness(data)
      toast.success('Business created successfully!')
      onSuccess?.()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create business'
      toast.error(message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Business name *"
        placeholder="e.g. Acme Corp"
        leftIcon={<Building2 className="w-4 h-4" />}
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Industry"
        placeholder="e.g. E-commerce, Healthcare..."
        error={errors.industry?.message}
        {...register('industry')}
      />

      <Input
        label="Website"
        type="url"
        placeholder="https://example.com"
        leftIcon={<Globe className="w-4 h-4" />}
        error={errors.website?.message}
        {...register('website')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Phone"
          type="tel"
          placeholder="+1 234 567 890"
          leftIcon={<Phone className="w-4 h-4" />}
          error={errors.phone?.message}
          {...register('phone')}
        />
        <Input
          label="Email"
          type="email"
          placeholder="contact@company.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
        <textarea
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows={3}
          placeholder="Brief description of your business..."
          {...register('description')}
        />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <div className="flex gap-3 justify-end pt-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={isSubmitting}>
          Create Business
        </Button>
      </div>
    </form>
  )
}
