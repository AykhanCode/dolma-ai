import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { createLogger } from '../../shared/utils/logger';

const logger = createLogger('ClaudeService');

export interface GenerateResponseOptions {
  systemPrompt?: string;
  message: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  maxTokens?: number;
}

export interface GenerateResponseResult {
  response: string;
  inputTokens: number;
  outputTokens: number;
  confidenceScore: number;
}

@Injectable()
export class ClaudeService {
  private readonly client: Anthropic;
  private readonly defaultModel = 'claude-3-5-sonnet-20241022';

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('CLAUDE_API_KEY');
    this.client = new Anthropic({ apiKey });
  }

  async generateResponse(options: GenerateResponseOptions): Promise<GenerateResponseResult> {
    const { systemPrompt, message, conversationHistory = [], maxTokens = 1024 } = options;

    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
      ...conversationHistory,
      { role: 'user', content: message },
    ];

    logger.info('Generating Claude response', {
      model: this.defaultModel,
      messageLength: message.length,
      historyLength: conversationHistory.length,
    });

    try {
      const params: Anthropic.MessageCreateParamsNonStreaming = {
        model: this.defaultModel,
        max_tokens: maxTokens,
        messages,
      };

      if (systemPrompt) {
        params.system = systemPrompt;
      }

      const response = await this.client.messages.create(params);

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new InternalServerErrorException('Unexpected response type from Claude');
      }

      const inputTokens = response.usage.input_tokens;
      const outputTokens = response.usage.output_tokens;

      // Simple confidence score based on output length and stop reason
      const confidenceScore =
        response.stop_reason === 'end_turn'
          ? Math.min(1, outputTokens / 100)
          : 0.5;

      logger.info('Claude response generated', {
        inputTokens,
        outputTokens,
        stopReason: response.stop_reason,
      });

      return {
        response: content.text,
        inputTokens,
        outputTokens,
        confidenceScore,
      };
    } catch (error) {
      logger.error('Claude API error', { error: error.message });
      if (error instanceof InternalServerErrorException) throw error;
      throw new InternalServerErrorException(`Claude API error: ${error.message}`);
    }
  }

  async countTokens(text: string): Promise<number> {
    // Approximate token count: ~4 characters per token (known approximation)
    return Math.ceil(text.length / 4);
  }
}
