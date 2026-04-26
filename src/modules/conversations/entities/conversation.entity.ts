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
import { Agent } from '../../agents/entities/agent.entity';
import { Business } from '../../businesses/entities/business.entity';
import { User } from '../../users/entities/user.entity';
import { Message } from './message.entity';

@Entity('conversations')
@Index(['businessId'])
@Index(['agentId'])
@Index(['status'])
@Index(['createdAt'])
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  agentId: string;

  @ManyToOne(() => Agent, (a) => a.conversations)
  @JoinColumn({ name: 'agentId' })
  agent: Agent;

  @Column()
  businessId: string;

  @ManyToOne(() => Business)
  @JoinColumn({ name: 'businessId' })
  business: Business;

  @Column()
  customerId: string;

  @Column({ nullable: true })
  customerName: string;

  @Column({ nullable: true })
  customerPhone: string;

  @Column({ nullable: true })
  customerEmail: string;

  @Column({ type: 'jsonb', default: '{}' })
  customerMetadata: any;

  @Column()
  channel: string;

  @Column({ nullable: true })
  channelConversationId: string;

  @Column({ default: 'open' })
  status: string;

  @Column({ nullable: true })
  assignedToHumanId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignedToHumanId' })
  assignedToHuman: User;

  @Column({ default: 0 })
  messageCount: number;

  @Column({ nullable: true })
  lastMessageAt: Date;

  @Column({ type: 'text', nullable: true })
  lastMessageContent: string;

  @Column({ nullable: true })
  resolvedBy: string;

  @Column({ nullable: true })
  resolutionTimeSeconds: number;

  @Column({ nullable: true })
  customerSatisfactionRating: number;

  @Column({ type: 'text', nullable: true })
  customerSatisfactionFeedback: string;

  @Column({ default: false })
  isFlagged: boolean;

  @Column({ nullable: true })
  flagReason: string;

  @Column('text', { array: true, default: '{}' })
  tags: string[];

  @OneToMany(() => Message, (m) => m.conversation)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
