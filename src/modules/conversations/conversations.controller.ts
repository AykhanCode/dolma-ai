import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dtos/create-conversation.dto';
import { SendMessageDto } from './dtos/send-message.dto';
import { QueryConversationsDto } from './dtos/query-conversations.dto';
import { JwtAuthGuard } from '../../core/guards/jwt.guard';
import { CurrentUser } from '../../core/decorators/current-user.decorator';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  findAll(@Query() query: QueryConversationsDto) {
    return this.conversationsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversationsService.findOne(id);
  }

  @Get(':id/messages')
  getMessages(@Param('id') id: string) {
    return this.conversationsService.getMessages(id);
  }

  @Post(':id/messages')
  sendMessage(@Param('id') id: string, @Body() dto: SendMessageDto) {
    return this.conversationsService.sendMessage(id, dto);
  }

  @Post(':id/escalate')
  escalate(@Param('id') id: string, @Body() body: { humanId: string }) {
    return this.conversationsService.escalate(id, body.humanId);
  }

  @Put(':id/close')
  close(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.conversationsService.close(id, userId);
  }

  @Post(':id/flag')
  flag(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.conversationsService.flag(id, body.reason);
  }

  @Post(':id/notes')
  addNote(@Param('id') id: string, @Body() body: { note: string }) {
    return { message: 'Note added', conversationId: id };
  }
}
