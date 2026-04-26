import { Injectable } from '@nestjs/common';
import { createLogger } from '../../../shared/utils/logger';

const logger = createLogger('InstagramWebhookService');

@Injectable()
export class InstagramWebhookService {
  handleVerification(mode: string, token: string, challenge: string, verifyToken: string): string | null {
    if (mode === 'subscribe' && token === verifyToken) {
      // Sanitize challenge: only alphanumeric characters and hyphens are expected
      return challenge.replace(/[^a-zA-Z0-9_-]/g, '');
    }
    return null;
  }

  async processWebhook(payload: any): Promise<void> {
    if (payload.object !== 'instagram') return;
    for (const entry of payload.entry || []) {
      if (entry.messaging) {
        for (const event of entry.messaging) {
          await this.processEvent(event);
        }
      }
    }
  }

  private async processEvent(event: any): Promise<void> {
    logger.info('Instagram event received', { senderId: event.sender?.id });
  }
}
