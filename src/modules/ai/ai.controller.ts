import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { IsString, IsOptional, IsArray } from 'class-validator';
import { ClaudeService, GenerateResponseResult } from './claude.service';

class GenerateDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  systemPrompt?: string;

  @IsOptional()
  @IsArray()
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

@Controller('ai')
export class AiController {
  constructor(private readonly claudeService: ClaudeService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generate(@Body() dto: GenerateDto): Promise<GenerateResponseResult> {
    return this.claudeService.generateResponse({
      message: dto.message,
      systemPrompt: dto.systemPrompt,
      conversationHistory: dto.conversationHistory,
    });
  }
}
