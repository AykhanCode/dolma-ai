import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Conversation } from './conversation.entity';

@Entity('messages')
@Index(['conversationId'])
@Index(['createdAt'])
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  conversationId: string;

  @ManyToOne(() => Conversation, (c) => c.messages)
  @JoinColumn({ name: 'conversationId' })
  conversation: Conversation;

  @Column()
  senderType: string;

  @Column()
  senderId: string;

  @Column({ nullable: true })
  senderName: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: 'text' })
  contentType: string;

  @Column('text', { array: true, default: '{}' })
  mediaUrls: string[];

  @Column({ default: false })
  wasAiGenerated: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  aiConfidenceScore: number;

  @Column({ type: 'jsonb', default: '{}' })
  aiMetadata: any;

  @Column({ nullable: true })
  channelMessageId: string;

  @Column({ default: 'delivered' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
