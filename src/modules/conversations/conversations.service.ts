import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { CreateConversationDto } from './dtos/create-conversation.dto';
import { SendMessageDto } from './dtos/send-message.dto';
import { QueryConversationsDto } from './dtos/query-conversations.dto';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(dto: CreateConversationDto): Promise<Conversation> {
    const conversation = this.conversationRepository.create(dto);
    return this.conversationRepository.save(conversation);
  }

  async findAll(query: QueryConversationsDto) {
    const { businessId, agentId, status, channel, page = 1, limit = 20 } = query;
    const where: any = {};
    if (businessId) where.businessId = businessId;
    if (agentId) where.agentId = agentId;
    if (status) where.status = status;
    if (channel) where.channel = channel;

    const [items, total] = await this.conversationRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { items, total, page, limit };
  }

  async findOne(id: string): Promise<Conversation> {
    const conv = await this.conversationRepository.findOne({
      where: { id },
      relations: ['messages'],
    });
    if (!conv) throw new NotFoundException('Conversation not found');
    return conv;
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    await this.findOne(conversationId);
    return this.messageRepository.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
    });
  }

  async sendMessage(conversationId: string, dto: SendMessageDto): Promise<Message> {
    const conversation = await this.findOne(conversationId);
    const message = this.messageRepository.create({ ...dto, conversationId });
    const saved = await this.messageRepository.save(message);

    conversation.messageCount += 1;
    conversation.lastMessageAt = new Date();
    conversation.lastMessageContent = dto.content.substring(0, 255);
    await this.conversationRepository.save(conversation);

    return saved;
  }

  async escalate(id: string, humanId: string): Promise<Conversation> {
    const conv = await this.findOne(id);
    conv.status = 'escalated';
    conv.assignedToHumanId = humanId;
    return this.conversationRepository.save(conv);
  }

  async close(id: string, resolvedBy?: string): Promise<Conversation> {
    const conv = await this.findOne(id);
    conv.status = 'closed';
    conv.resolvedBy = resolvedBy;
    return this.conversationRepository.save(conv);
  }

  async flag(id: string, reason: string): Promise<Conversation> {
    const conv = await this.findOne(id);
    conv.isFlagged = true;
    conv.flagReason = reason;
    return this.conversationRepository.save(conv);
  }
}
