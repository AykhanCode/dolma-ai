import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { createPostSchema, type CreatePostFormData } from '@/utils/validators'
import { useBusinessStore } from '@/store/businessStore'
import { contentService } from '@/services/content.service'
import { CHANNELS } from '@/utils/constants'
import type { AgentChannel } from '@/types'
import toast from 'react-hot-toast'

interface CreatePostFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function CreatePostForm({ onSuccess, onCancel }: CreatePostFormProps) {
  const { currentBusiness } = useBusinessStore()
  const [imageUrl, setImageUrl] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { channels: [] },
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

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const result = await contentService.uploadImage(formData)
      setImageUrl(result.url)
    } catch {
      toast.error('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file)
    }
  }

  const onSubmit = async (data: CreatePostFormData) => {
    if (!currentBusiness) {
      toast.error('Please select a business first')
      return
    }
    try {
      await contentService.create({ ...data, businessId: currentBusiness.id, imageUrl })
      toast.success('Post created successfully!')
      onSuccess?.()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create post'
      toast.error(message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Image uploader */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">Image</label>
        {imageUrl ? (
          <div className="relative">
            <img src={imageUrl} alt="Post preview" className="w-full h-48 object-cover rounded-lg" />
            <button
              type="button"
              onClick={() => setImageUrl('')}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow text-neutral-600 hover:text-neutral-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? 'border-primary-400 bg-primary-light' : 'border-neutral-300 hover:border-primary-300'
            }`}
          >
            {isUploading ? (
              <p className="text-sm text-neutral-500">Uploading...</p>
            ) : (
              <>
                <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-sm text-neutral-600">Drag & drop or{' '}
                  <label className="text-primary-600 cursor-pointer hover:underline">
                    browse
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file)
                      }}
                    />
                  </label>
                </p>
                <p className="text-xs text-neutral-400 mt-1">PNG, JPG up to 10MB</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Caption */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Caption *</label>
        <textarea
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm placeholder-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows={4}
          placeholder="Write your caption here..."
          {...register('caption')}
        />
        {errors.caption && <p className="text-xs text-red-500">{errors.caption.message}</p>}
      </div>

      {/* Channels */}
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

      {/* Schedule */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Schedule (optional)</label>
        <input
          type="datetime-local"
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          {...register('scheduledAt')}
        />
      </div>

      <div className="flex gap-3 justify-end pt-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="button" variant="secondary" onClick={handleSubmit((data) => {
          if (!currentBusiness) { toast.error('Select a business first'); return }
          contentService.create({ ...data, businessId: currentBusiness.id, imageUrl }).then(() => {
            toast.success('Draft saved!'); onSuccess?.()
          }).catch(() => toast.error('Failed to save'))
        })}>
          Save Draft
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {watch('scheduledAt') ? 'Schedule Post' : 'Publish Now'}
        </Button>
      </div>
    </form>
  )
}
