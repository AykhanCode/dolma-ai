import { Injectable } from '@nestjs/common';

@Injectable()
export class InstagramWebhookService {
  handleVerification(mode: string, token: string, challenge: string, verifyToken: string): string | null {
    if (mode === 'subscribe' && token === verifyToken) {
      return challenge;
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
    console.log('Instagram event received:', event.sender?.id);
  }
}
