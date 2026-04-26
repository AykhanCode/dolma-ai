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
import { User } from '../../users/entities/user.entity';
import { Agent } from '../../agents/entities/agent.entity';
import { Post } from '../../content/entities/post.entity';
import { BusinessDocument } from './business-document.entity';

@Entity('businesses')
@Index(['ownerId'])
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ownerId: string;

  @ManyToOne(() => User, (u) => u.businesses)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  websiteUrl: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: 'UTC' })
  timezone: string;

  @Column({ type: 'jsonb', nullable: true })
  hoursJson: any;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  coverImageUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  businessProfileData: any;

  @Column({ default: 'active' })
  status: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'jsonb', default: '{}' })
  settings: any;

  @OneToMany(() => Agent, (a) => a.business)
  agents: Agent[];

  @OneToMany(() => Post, (p) => p.business)
  posts: Post[];

  @OneToMany(() => BusinessDocument, (bd) => bd.business)
  documents: BusinessDocument[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
