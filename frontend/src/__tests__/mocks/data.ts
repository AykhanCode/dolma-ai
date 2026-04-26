export const mockUser = {
  id: '1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
}

export const mockTokens = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
}

export const mockAgent = {
  id: '1',
  name: 'Support Bot',
  description: 'Customer support agent',
  status: 'active' as const,
  channels: ['whatsapp'] as const,
}

export const mockBusiness = {
  id: '1',
  name: 'Test Business',
  industry: 'Technology',
  email: 'business@example.com',
}

export const mockAgents = [
  mockAgent,
  {
    id: '2',
    name: 'Sales Bot',
    description: 'Sales assistant',
    status: 'draft' as const,
    channels: ['instagram'] as const,
  },
]
