import { Injectable } from '@nestjs/common';

@Injectable()
export class WhatsappWebhookService {
  handleVerification(mode: string, token: string, challenge: string, verifyToken: string): string | null {
    if (mode === 'subscribe' && token === verifyToken) {
      return challenge;
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
    console.log('WhatsApp message received:', message.id);
  }
}
