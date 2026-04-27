// Auth types
export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: UserRole
  avatar?: string
  createdAt: string
  updatedAt: string
}

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'agent'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface SignupDto {
  email: string
  password: string
  firstName?: string
  lastName?: string
  role?: UserRole
}

// Business types
export interface Business {
  id: string
  name: string
  slug: string
  industry?: string
  website?: string
  phone?: string
  email?: string
  description?: string
  logoUrl?: string
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface BusinessDocument {
  id: string
  businessId: string
  name: string
  type: 'pdf' | 'url' | 'text'
  content?: string
  url?: string
  createdAt: string
}

// Agent types
export interface Agent {
  id: string
  name: string
  description?: string
  status: AgentStatus
  businessId: string
  channels: AgentChannel[]
  personality?: AgentPersonality
  createdAt: string
  updatedAt: string
}

export type AgentStatus = 'draft' | 'active' | 'paused' | 'archived'
export type AgentChannel = 'whatsapp' | 'instagram' | 'tiktok' | 'facebook'

export interface AgentPersonality {
  tone: 'professional' | 'friendly' | 'casual' | 'formal'
  language: string
  greeting?: string
  fallbackMessage?: string
}

export interface CreateAgentDto {
  name: string
  description?: string
  businessId: string
  channels: AgentChannel[]
  personality?: AgentPersonality
}

// Conversation types
export interface Conversation {
  id: string
  agentId: string
  businessId: string
  customerId: string
  customerName?: string
  customerPhone?: string
  status: ConversationStatus
  channel: AgentChannel
  lastMessage?: string
  lastMessageAt?: string
  unreadCount: number
  tags: string[]
  satisfactionRating?: number
  createdAt: string
  updatedAt: string
}

export type ConversationStatus = 'open' | 'closed' | 'escalated' | 'pending'

export interface Message {
  id: string
  conversationId: string
  content: string
  type: MessageType
  sender: MessageSender
  createdAt: string
  metadata?: Record<string, unknown>
}

export type MessageType = 'text' | 'image' | 'audio' | 'video' | 'file'
export type MessageSender = 'customer' | 'agent' | 'bot'

export interface ConversationFilters {
  status?: ConversationStatus
  channel?: AgentChannel
  dateFrom?: string
  dateTo?: string
  search?: string
}

// Post / Content types
export interface Post {
  id: string
  businessId: string
  title?: string
  caption: string
  imageUrl?: string
  channels: AgentChannel[]
  status: PostStatus
  scheduledAt?: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed'

export interface CreatePostDto {
  businessId: string
  caption: string
  imageUrl?: string
  channels: AgentChannel[]
  scheduledAt?: string
}

// Analytics types
export interface AnalyticsDashboard {
  totalConversations: number
  botSuccessRate: number
  avgResponseTime: number
  satisfactionScore: number
  totalPosts: number
  totalEngagement: number
  revenue?: number
  snapshots: AnalyticsSnapshot[]
}

export interface AnalyticsSnapshot {
  id: string
  businessId: string
  date: string
  totalConversations: number
  botHandled: number
  humanHandled: number
  satisfactionScore: number
  channelMetrics?: Record<string, ChannelMetrics>
}

export interface ChannelMetrics {
  conversations: number
  messages: number
  satisfaction?: number
}

// API types
export interface ApiResponse<T> {
  data: T
  message?: string
  statusCode?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  statusCode: number
  error?: string
}

// UI types
export interface ToastNotification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export interface ModalState {
  isOpen: boolean
  title?: string
  content?: React.ReactNode
}

export type SelectOption = {
  label: string
  value: string
}
