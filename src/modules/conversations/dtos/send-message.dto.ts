import { IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class SendMessageDto {
  @IsString()
  senderType: string;

  @IsString()
  senderId: string;

  @IsOptional()
  @IsString()
  senderName?: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  contentType?: string;

  @IsOptional()
  @IsArray()
  mediaUrls?: string[];

  @IsOptional()
  @IsBoolean()
  wasAiGenerated?: boolean;
}
