import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from './entities/business.entity';
import { BusinessDocument } from './entities/business-document.entity';
import { CreateBusinessDto } from './dtos/create-business.dto';
import { UpdateBusinessDto } from './dtos/update-business.dto';

@Injectable()
export class BusinessesService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(BusinessDocument)
    private readonly documentRepository: Repository<BusinessDocument>,
  ) {}

  async create(ownerId: string, dto: CreateBusinessDto): Promise<Business> {
    const business = this.businessRepository.create({ ...dto, ownerId });
    return this.businessRepository.save(business);
  }

  async findAll(ownerId: string): Promise<Business[]> {
    return this.businessRepository.find({ where: { ownerId } });
  }

  async findOne(id: string, ownerId: string): Promise<Business> {
    const business = await this.businessRepository.findOne({
      where: { id, ownerId },
      relations: ['documents'],
    });
    if (!business) throw new NotFoundException('Business not found');
    return business;
  }

  async update(id: string, ownerId: string, dto: UpdateBusinessDto): Promise<Business> {
    const business = await this.findOne(id, ownerId);
    Object.assign(business, dto);
    return this.businessRepository.save(business);
  }

  async remove(id: string, ownerId: string): Promise<void> {
    const business = await this.findOne(id, ownerId);
    await this.businessRepository.softRemove(business);
  }

  async addDocument(
    businessId: string,
    ownerId: string,
    data: { documentType: string; title: string; content?: string; fileUrl?: string; extractedText?: string },
  ): Promise<BusinessDocument> {
    await this.findOne(businessId, ownerId);
    const doc = this.documentRepository.create({
      businessId,
      uploadedBy: ownerId,
      ...data,
    });
    return this.documentRepository.save(doc);
  }

  async getDocuments(businessId: string, ownerId: string): Promise<BusinessDocument[]> {
    await this.findOne(businessId, ownerId);
    return this.documentRepository.find({ where: { businessId } });
  }
}
