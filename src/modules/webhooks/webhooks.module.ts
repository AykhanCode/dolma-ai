import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { WhatsappWebhookService } from './services/whatsapp-webhook.service';
import { InstagramWebhookService } from './services/instagram-webhook.service';
import { TiktokWebhookService } from './services/tiktok-webhook.service';

@Module({
  controllers: [WebhooksController],
  providers: [WhatsappWebhookService, InstagramWebhookService, TiktokWebhookService],
})
export class WebhooksModule {}
