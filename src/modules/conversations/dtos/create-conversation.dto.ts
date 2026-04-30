import { IsString, IsOptional } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  agentId: string;

  @IsString()
  businessId: string;

  @IsString()
  customerId: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsString()
  customerEmail?: string;

  @IsString()
  channel: string;

  @IsOptional()
  @IsString()
  channelConversationId?: string;
}
