import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Business } from './business.entity';

@Entity('business_documents')
export class BusinessDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  businessId: string;

  @ManyToOne(() => Business, (b) => b.documents)
  @JoinColumn({ name: 'businessId' })
  business: Business;

  @Column()
  documentType: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ nullable: true })
  fileUrl: string;

  @Column({ type: 'text', nullable: true })
  extractedText: string;

  @Column()
  uploadedBy: string;

  @CreateDateColumn()
  createdAt: Date;
}
