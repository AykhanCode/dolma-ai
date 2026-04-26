import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('/api/v1/auth/login', async () => {
    return HttpResponse.json({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      },
    })
  }),

  http.post('/api/v1/auth/signup', async () => {
    return HttpResponse.json({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: {
        id: '1',
        email: 'newuser@example.com',
        firstName: 'New',
        lastName: 'User',
      },
    })
  }),

  http.post('/api/v1/auth/logout', async () => {
    return HttpResponse.json({})
  }),

  http.get('/api/v1/auth/me', async () => {
    return HttpResponse.json({
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    })
  }),

  http.get('/api/v1/agents', async () => {
    return HttpResponse.json({
      data: [
        {
          id: '1',
          name: 'Support Bot',
          status: 'active',
          channels: ['whatsapp'],
        },
      ],
      total: 1,
      page: 1,
      limit: 20,
    })
  }),

  http.post('/api/v1/agents', async () => {
    return HttpResponse.json({
      id: '2',
      name: 'New Agent',
      status: 'draft',
      channels: ['whatsapp'],
    })
  }),

  http.get('/api/v1/businesses', async () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'Test Business',
        industry: 'Technology',
      },
    ])
  }),
]
