import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Bot } from 'lucide-react'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { Select } from '@/components/common/Select'
import { createAgentSchema, type CreateAgentFormData } from '@/utils/validators'
import { useAgentStore } from '@/store/agentStore'
import { useBusinessStore } from '@/store/businessStore'
import { CHANNELS } from '@/utils/constants'
import type { AgentChannel } from '@/types'
import toast from 'react-hot-toast'

const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
]

interface CreateAgentFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function CreateAgentForm({ onSuccess, onCancel }: CreateAgentFormProps) {
  const { createAgent } = useAgentStore()
  const { currentBusiness } = useBusinessStore()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateAgentFormData>({
    resolver: zodResolver(createAgentSchema),
    defaultValues: {
      channels: [],
      personality: { tone: 'professional', language: 'en' },
    },
  })

  const selectedChannels = watch('channels') || []

  const toggleChannel = (channel: AgentChannel) => {
    const current = selectedChannels
    if (current.includes(channel)) {
      setValue('channels', current.filter((c) => c !== channel))
    } else {
      setValue('channels', [...current, channel])
    }
  }

  const onSubmit = async (data: CreateAgentFormData) => {
    if (!currentBusiness) {
      toast.error('Please select a business first')
      return
    }
    try {
      await createAgent({ ...data, businessId: currentBusiness.id })
      toast.success('Agent created successfully!')
      onSuccess?.()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create agent'
      toast.error(message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Agent name *"
        placeholder="e.g. Sales Bot, Support Agent"
        leftIcon={<Bot className="w-4 h-4" />}
        error={errors.name?.message}
        {...register('name')}
      />

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
        <textarea
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm placeholder-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows={2}
          placeholder="What does this agent do?"
          {...register('description')}
        />
      </div>

      {/* Channel selector */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">Channels *</label>
        <div className="flex flex-wrap gap-2">
          {CHANNELS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => toggleChannel(value as AgentChannel)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                selectedChannels.includes(value as AgentChannel)
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-neutral-600 border-neutral-300 hover:border-primary-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {errors.channels && <p className="mt-1 text-xs text-red-500">{errors.channels.message}</p>}
      </div>

      {/* Personality */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-neutral-700">Personality</p>
        <Select
          label="Tone"
          options={TONE_OPTIONS}
          {...register('personality.tone')}
        />
        <Input
          label="Greeting message"
          placeholder="Hi! How can I help you today?"
          {...register('personality.greeting')}
        />
        <Input
          label="Fallback message"
          placeholder="I'm sorry, I didn't understand. Let me connect you to a human agent."
          {...register('personality.fallbackMessage')}
        />
      </div>

      <div className="flex gap-3 justify-end pt-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={isSubmitting}>
          Create Agent
        </Button>
      </div>
    </form>
  )
}
