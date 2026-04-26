import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AnalyticsSnapshot } from './entities/analytics-snapshot.entity';
import { AnalyticsQueryDto } from './dtos/analytics-query.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(AnalyticsSnapshot)
    private readonly snapshotRepository: Repository<AnalyticsSnapshot>,
  ) {}

  async getDashboard(query: AnalyticsQueryDto) {
    const { businessId, startDate, endDate } = query;
    const where: any = {};
    if (businessId) where.businessId = businessId;
    if (startDate && endDate) {
      where.snapshotDate = Between(new Date(startDate), new Date(endDate));
    }

    const snapshots = await this.snapshotRepository.find({ where, order: { snapshotDate: 'DESC' } });

    const totals = snapshots.reduce(
      (acc, s) => ({
        totalConversations: acc.totalConversations + s.totalConversations,
        newConversations: acc.newConversations + s.newConversations,
        botHandled: acc.botHandled + s.botHandled,
        humanEscalated: acc.humanEscalated + s.humanEscalated,
        postsPublished: acc.postsPublished + s.postsPublished,
        totalEngagement: acc.totalEngagement + s.totalEngagement,
      }),
      { totalConversations: 0, newConversations: 0, botHandled: 0, humanEscalated: 0, postsPublished: 0, totalEngagement: 0 },
    );

    return { snapshots, totals };
  }

  async getConversationStats(query: AnalyticsQueryDto) {
    return this.getDashboard(query);
  }

  async getContentPerformance(query: AnalyticsQueryDto) {
    return this.getDashboard(query);
  }

  async getChannelBreakdown(query: AnalyticsQueryDto) {
    const { snapshots } = await this.getDashboard(query);
    const channelData: Record<string, any> = {};
    for (const s of snapshots) {
      if (s.channelMetrics) {
        for (const [channel, metrics] of Object.entries(s.channelMetrics)) {
          if (!channelData[channel]) channelData[channel] = [];
          channelData[channel].push(metrics);
        }
      }
    }
    return channelData;
  }

  async generateReport(query: AnalyticsQueryDto) {
    const dashboard = await this.getDashboard(query);
    return {
      generatedAt: new Date(),
      query,
      ...dashboard,
    };
  }

  async createSnapshot(data: Partial<AnalyticsSnapshot>): Promise<AnalyticsSnapshot> {
    const snapshot = this.snapshotRepository.create(data);
    return this.snapshotRepository.save(snapshot);
  }
}
