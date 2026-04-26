import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class UpdateAgentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  systemPrompt?: string;

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

  @IsOptional()
  escalationRules?: any;

  @IsOptional()
  knowledgeBase?: any;
}
