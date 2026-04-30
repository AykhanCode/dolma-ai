import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { WhatsappWebhookService } from './services/whatsapp-webhook.service';
import { InstagramWebhookService } from './services/instagram-webhook.service';
import { TiktokWebhookService } from './services/tiktok-webhook.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(
    private readonly configService: ConfigService,
    private readonly whatsappService: WhatsappWebhookService,
    private readonly instagramService: InstagramWebhookService,
    private readonly tiktokService: TiktokWebhookService,
  ) {}

  @Get('whatsapp')
  verifyWhatsapp(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response,
  ) {
    const verifyToken = this.configService.get('WHATSAPP_VERIFY_TOKEN', '');
    const result = this.whatsappService.handleVerification(mode, token, challenge, verifyToken);
    if (result) {
      res.status(HttpStatus.OK).send(result);
    } else {
      res.status(HttpStatus.FORBIDDEN).send('Verification failed');
    }
  }

  @Post('whatsapp')
  async handleWhatsapp(@Body() payload: any, @Res() res: Response) {
    await this.whatsappService.processWebhook(payload);
    res.status(HttpStatus.OK).json({ status: 'ok' });
  }

  @Get('instagram')
  verifyInstagram(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response,
  ) {
    const verifyToken = this.configService.get('INSTAGRAM_VERIFY_TOKEN', '');
    const result = this.instagramService.handleVerification(mode, token, challenge, verifyToken);
    if (result) {
      res.status(HttpStatus.OK).send(result);
    } else {
      res.status(HttpStatus.FORBIDDEN).send('Verification failed');
    }
  }

  @Post('instagram')
  async handleInstagram(@Body() payload: any, @Res() res: Response) {
    await this.instagramService.processWebhook(payload);
    res.status(HttpStatus.OK).json({ status: 'ok' });
  }

  @Post('tiktok')
  async handleTiktok(@Body() payload: any, @Res() res: Response) {
    await this.tiktokService.processWebhook(payload);
    res.status(HttpStatus.OK).json({ status: 'ok' });
  }
}
