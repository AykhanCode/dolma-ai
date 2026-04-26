import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Business } from '../../businesses/entities/business.entity';

@Entity('posts')
@Index(['businessId'])
@Index(['status'])
@Index(['publishedAt'])
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  businessId: string;

  @ManyToOne(() => Business)
  @JoinColumn({ name: 'businessId' })
  business: Business;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'text' })
  caption: string;

  @Column({ default: true })
  captionAiGenerated: boolean;

  @Column({ nullable: true })
  originalImageUrl: string;

  @Column({ nullable: true })
  enhancedImageUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  imageMetadata: any;

  @Column({ type: 'jsonb', default: '[]' })
  channels: string[];

  @Column({ nullable: true })
  scheduledTime: Date;

  @Column({ nullable: true })
  publishedAt: Date;

  @Column({ default: 'draft' })
  status: string;

  @Column({ type: 'jsonb', default: '{}' })
  metrics: any;

  @Column({ nullable: true })
  metricsLastUpdatedAt: Date;

  @Column({ type: 'jsonb', default: '{}' })
  channelPostIds: any;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  engagementRate: number;

  @Column({ default: 0 })
  conversionCount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  revenueAttributed: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
