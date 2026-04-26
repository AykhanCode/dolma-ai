import { Injectable } from '@nestjs/common';
import { createLogger } from '../../../shared/utils/logger';

const logger = createLogger('TiktokWebhookService');

@Injectable()
export class TiktokWebhookService {
  async processWebhook(payload: any): Promise<void> {
    logger.info('TikTok webhook received', { payload });
  }
}
