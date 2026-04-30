import { Injectable } from '@nestjs/common';
import { createLogger } from '../../../shared/utils/logger';

const logger = createLogger('WhatsappWebhookService');

@Injectable()
export class WhatsappWebhookService {
  handleVerification(mode: string, token: string, challenge: string, verifyToken: string): string | null {
    if (mode === 'subscribe' && token === verifyToken) {
      // Sanitize challenge: only alphanumeric characters and hyphens are expected
      return challenge.replace(/[^a-zA-Z0-9_-]/g, '');
    }
    return null;
  }

  async processWebhook(payload: any): Promise<void> {
    if (payload.object !== 'whatsapp_business_account') return;
    for (const entry of payload.entry || []) {
      for (const change of entry.changes || []) {
        if (change.value?.messages) {
          for (const message of change.value.messages) {
            await this.processMessage(message, change.value.metadata);
          }
        }
      }
    }
  }

  private async processMessage(message: any, _metadata: any): Promise<void> {
    logger.info('WhatsApp message received', { messageId: message.id });
  }
}
