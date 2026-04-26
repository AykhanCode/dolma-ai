import { Injectable } from '@nestjs/common';

@Injectable()
export class TiktokWebhookService {
  async processWebhook(payload: any): Promise<void> {
    console.log('TikTok webhook received:', JSON.stringify(payload));
  }
}
