import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  Unique,
} from 'typeorm';

@Entity('analytics_snapshots')
@Index(['businessId', 'snapshotDate', 'snapshotHour'])
@Unique(['businessId', 'snapshotDate', 'snapshotHour'])
export class AnalyticsSnapshot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  businessId: string;

  @Column({ type: 'date' })
  snapshotDate: Date;

  @Column({ nullable: true })
  snapshotHour: number;

  @Column({ default: 0 })
  totalConversations: number;

  @Column({ default: 0 })
  newConversations: number;

  @Column({ default: 0 })
  botHandled: number;

  @Column({ default: 0 })
  humanEscalated: number;

  @Column({ nullable: true })
  avgResponseTimeMs: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  customerSatisfaction: number;

  @Column({ default: 0 })
  postsPublished: number;

  @Column({ default: 0 })
  totalEngagement: number;

  @Column({ default: 0 })
  totalClicks: number;

  @Column({ default: 0 })
  totalConversions: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  adSpend: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  revenueGenerated: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  roi: number;

  @Column({ type: 'jsonb', default: '{}' })
  channelMetrics: any;

  @CreateDateColumn()
  createdAt: Date;
}
