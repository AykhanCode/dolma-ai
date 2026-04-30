import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Business } from '../../businesses/entities/business.entity';
import { Conversation } from '../../conversations/entities/conversation.entity';

@Entity('agents')
@Index(['businessId'])
export class Agent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  businessId: string;

  @ManyToOne(() => Business, (b) => b.agents)
  @JoinColumn({ name: 'businessId' })
  business: Business;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  category: string;

  @Column({ type: 'text' })
  systemPrompt: string;

  @Column({ default: 'friendly' })
  personality: string;

  @Column({ default: 'en' })
  language: string;

  @Column({ type: 'jsonb', default: '[]' })
  channels: string[];

  @Column({ type: 'jsonb', default: '{}' })
  channelCredentials: any;

  @Column({ type: 'jsonb', default: '{}' })
  escalationRules: any;

  @Column({ default: 500 })
  maxResponseLength: number;

  @Column({ default: 0 })
  responseDelayMs: number;

  @Column({ type: 'jsonb', default: '{}' })
  knowledgeBase: any;

  @Column('text', { array: true, default: '{}' })
  attachedDocuments: string[];

  @Column({ default: 'draft' })
  status: string;

  @Column({ default: 'not_deployed' })
  deploymentStatus: string;

  @Column({ type: 'bigint', default: 0 })
  totalConversations: number;

  @Column({ type: 'bigint', default: 0 })
  successfulResolutions: number;

  @Column({ type: 'bigint', default: 0 })
  escalationCount: number;

  @Column({ default: 0 })
  avgResponseTimeMs: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  satisfactionRating: number;

  @OneToMany(() => Conversation, (c) => c.agent)
  conversations: Conversation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
