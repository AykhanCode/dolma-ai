export const APP_NAME = 'DOLMA AI'
export const APP_VERSION = '1.0.0'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'
export const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  AGENTS: '/agents',
  AGENT_CREATE: '/agents/create',
  AGENT_DETAIL: '/agents/:id',
  CHAT: '/chat',
  CONTENT: '/content',
  CONTENT_CREATE: '/content/create',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
  SETTINGS_BUSINESS: '/settings/business',
  SETTINGS_TEAM: '/settings/team',
  NOT_FOUND: '/404',
} as const

export const CHANNELS = [
  { value: 'whatsapp', label: 'WhatsApp', color: '#25D366' },
  { value: 'instagram', label: 'Instagram', color: '#E1306C' },
  { value: 'tiktok', label: 'TikTok', color: '#000000' },
  { value: 'facebook', label: 'Facebook', color: '#1877F2' },
] as const

export const AGENT_STATUSES = {
  draft: { label: 'Draft', color: 'bg-neutral-100 text-neutral-600' },
  active: { label: 'Active', color: 'bg-green-100 text-green-700' },
  paused: { label: 'Paused', color: 'bg-yellow-100 text-yellow-700' },
  archived: { label: 'Archived', color: 'bg-red-100 text-red-700' },
} as const

export const CONVERSATION_STATUSES = {
  open: { label: 'Open', color: 'bg-blue-100 text-blue-700' },
  closed: { label: 'Closed', color: 'bg-neutral-100 text-neutral-600' },
  escalated: { label: 'Escalated', color: 'bg-red-100 text-red-700' },
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
} as const

export const POST_STATUSES = {
  draft: { label: 'Draft', color: 'bg-neutral-100 text-neutral-600' },
  scheduled: { label: 'Scheduled', color: 'bg-blue-100 text-blue-700' },
  published: { label: 'Published', color: 'bg-green-100 text-green-700' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-700' },
} as const

export const USER_ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'agent', label: 'Agent' },
] as const
