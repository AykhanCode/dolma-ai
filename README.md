# DOLMA AI - All-in-One AI Agent Platform for Businesses

DOLMA AI is a comprehensive SaaS backend platform that combines AI Agent Builder, Social Media Content Manager, Unified Chat Dashboard, and Analytics.

## Tech Stack

- **Runtime**: Node.js v20 LTS
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL 15+ with TypeORM
- **Cache/Queue**: Redis 7+
- **Authentication**: JWT + bcrypt
- **Storage**: AWS S3
- **Logging**: Winston

## Project Structure

```
src/
├── core/           # Guards, decorators, config, database
├── modules/        # Feature modules (auth, users, businesses, agents, etc.)
├── shared/         # Shared utilities, filters, interfaces
└── database/       # ORM config
```

## Getting Started

### Prerequisites

- Node.js v20+
- Docker & Docker Compose

### Setup

1. Clone the repository
2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
3. Start infrastructure:
   ```bash
   docker-compose up -d
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start development server:
   ```bash
   npm run start:dev
   ```

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout

### Businesses
- `POST /api/v1/businesses` - Create business
- `GET /api/v1/businesses` - List businesses
- `GET /api/v1/businesses/:id` - Get business
- `PUT /api/v1/businesses/:id` - Update business
- `DELETE /api/v1/businesses/:id` - Delete business
- `POST /api/v1/businesses/:id/documents` - Upload document
- `GET /api/v1/businesses/:id/documents` - List documents

### Agents
- `POST /api/v1/agents` - Create agent
- `GET /api/v1/agents` - List agents
- `GET /api/v1/agents/:id` - Get agent
- `PUT /api/v1/agents/:id` - Update agent
- `POST /api/v1/agents/:id/deploy` - Deploy agent
- `POST /api/v1/agents/:id/pause` - Pause agent
- `POST /api/v1/agents/:id/resume` - Resume agent

### Conversations
- `GET /api/v1/conversations` - List conversations
- `GET /api/v1/conversations/:id` - Get conversation
- `GET /api/v1/conversations/:id/messages` - Get messages
- `POST /api/v1/conversations/:id/messages` - Send message
- `POST /api/v1/conversations/:id/escalate` - Escalate conversation
- `PUT /api/v1/conversations/:id/close` - Close conversation
- `POST /api/v1/conversations/:id/flag` - Flag conversation

### Content
- `POST /api/v1/content` - Create post
- `GET /api/v1/content` - List posts
- `GET /api/v1/content/:id` - Get post
- `PUT /api/v1/content/:id` - Update post
- `DELETE /api/v1/content/:id` - Delete post
- `POST /api/v1/content/:id/publish` - Publish post
- `POST /api/v1/content/:id/schedule` - Schedule post

### Analytics
- `GET /api/v1/analytics/dashboard` - Dashboard metrics
- `GET /api/v1/analytics/conversations` - Conversation stats
- `GET /api/v1/analytics/content` - Content performance
- `GET /api/v1/analytics/channels` - Channel breakdown
- `POST /api/v1/analytics/report` - Generate report

### Webhooks
- `POST /api/v1/webhooks/whatsapp` - WhatsApp webhook
- `POST /api/v1/webhooks/instagram` - Instagram webhook
- `POST /api/v1/webhooks/tiktok` - TikTok webhook

## Environment Variables

See `.env.example` for all required environment variables.

## Development

```bash
npm run start:dev   # Development with hot reload
npm run build       # Production build
npm run test        # Run tests
```
