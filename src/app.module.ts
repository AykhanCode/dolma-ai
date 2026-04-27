import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './core/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BusinessesModule } from './modules/businesses/businesses.module';
import { AgentsModule } from './modules/agents/agents.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { ContentModule } from './modules/content/content.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { StorageModule } from './modules/storage/storage.module';
import { AiModule } from './modules/ai/ai.module';
import { AdminModule } from './modules/admin/admin.module';
import { validateEnv } from './core/config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    DatabaseModule,
    AuthModule,
    UsersModule,
    BusinessesModule,
    AgentsModule,
    ConversationsModule,
    ContentModule,
    AnalyticsModule,
    WebhooksModule,
    StorageModule,
    AiModule,
    AdminModule,
  ],
})
export class AppModule {}
