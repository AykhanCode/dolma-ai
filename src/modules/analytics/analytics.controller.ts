import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto } from './dtos/analytics-query.dto';
import { JwtAuthGuard } from '../../core/guards/jwt.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboard(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getDashboard(query);
  }

  @Get('conversations')
  getConversationStats(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getConversationStats(query);
  }

  @Get('content')
  getContentPerformance(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getContentPerformance(query);
  }

  @Get('channels')
  getChannelBreakdown(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getChannelBreakdown(query);
  }

  @Post('report')
  generateReport(@Body() query: AnalyticsQueryDto) {
    return this.analyticsService.generateReport(query);
  }
}
