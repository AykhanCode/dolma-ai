import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { IsString, IsOptional, IsArray } from 'class-validator';
import { ClaudeService, GenerateResponseResult } from './claude.service';
import { JwtAuthGuard } from '../../core/guards/jwt.guard';

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
@UseGuards(JwtAuthGuard)
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
