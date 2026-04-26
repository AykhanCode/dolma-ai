import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../../modules/users/entities/user.entity';
import { Business } from '../../modules/businesses/entities/business.entity';
import { BusinessDocument } from '../../modules/businesses/entities/business-document.entity';
import { Agent } from '../../modules/agents/entities/agent.entity';
import { Conversation } from '../../modules/conversations/entities/conversation.entity';
import { Message } from '../../modules/conversations/entities/message.entity';
import { Post } from '../../modules/content/entities/post.entity';
import { AnalyticsSnapshot } from '../../modules/analytics/entities/analytics-snapshot.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        username: configService.get('DATABASE_USERNAME', 'dolma'),
        password: configService.get('DATABASE_PASSWORD', 'dolma_password'),
        database: configService.get('DATABASE_NAME', 'dolma_ai'),
        entities: [
          User,
          Business,
          BusinessDocument,
          Agent,
          Conversation,
          Message,
          Post,
          AnalyticsSnapshot,
        ],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
        ssl: configService.get('DATABASE_SSL') === 'true' ? { rejectUnauthorized: false } : false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
