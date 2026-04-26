import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateAgentDto {
  @IsString()
  businessId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  category: string;

  @IsString()
  systemPrompt: string;

  @IsOptional()
  @IsString()
  personality?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsArray()
  channels?: string[];

  @IsOptional()
  @IsNumber()
  maxResponseLength?: number;
}
