import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BusinessesService } from '../../../modules/businesses/businesses.service';
import { Business } from '../../../modules/businesses/entities/business.entity';
import { BusinessDocument } from '../../../modules/businesses/entities/business-document.entity';

describe('BusinessesService', () => {
  let service: BusinessesService;
  let businessRepository: jest.Mocked<Partial<Repository<Business>>>;
  let documentRepository: jest.Mocked<Partial<Repository<BusinessDocument>>>;

  const mockBusiness: Partial<Business> = {
    id: 'biz-1',
    name: 'Acme Corp',
    ownerId: 'user-1',
    category: 'technology',
    status: 'active',
  };

  const mockDocument: Partial<BusinessDocument> = {
    id: 'doc-1',
    businessId: 'biz-1',
    documentType: 'policy',
    title: 'Privacy Policy',
    uploadedBy: 'user-1',
  };

  beforeEach(async () => {
    businessRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      softRemove: jest.fn(),
    };

    documentRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessesService,
        {
          provide: getRepositoryToken(Business),
          useValue: businessRepository,
        },
        {
          provide: getRepositoryToken(BusinessDocument),
          useValue: documentRepository,
        },
      ],
    }).compile();

    service = module.get<BusinessesService>(BusinessesService);
  });

  describe('create', () => {
    it('should create and return a new business', async () => {
      (businessRepository.create as jest.Mock).mockReturnValue(mockBusiness);
      (businessRepository.save as jest.Mock).mockResolvedValue(mockBusiness);

      const result = await service.create('user-1', { name: 'Acme Corp', category: 'technology' } as never);

      expect(businessRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ ownerId: 'user-1', name: 'Acme Corp' }),
      );
      expect(result).toEqual(mockBusiness);
    });
  });

  describe('findAll', () => {
    it('should return all businesses for a given owner', async () => {
      (businessRepository.find as jest.Mock).mockResolvedValue([mockBusiness]);

      const result = await service.findAll('user-1');

      expect(businessRepository.find).toHaveBeenCalledWith({ where: { ownerId: 'user-1' } });
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return a business when found', async () => {
      (businessRepository.findOne as jest.Mock).mockResolvedValue(mockBusiness);

      const result = await service.findOne('biz-1', 'user-1');

      expect(businessRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'biz-1', ownerId: 'user-1' },
        relations: ['documents'],
      });
      expect(result).toEqual(mockBusiness);
    });

    it('should throw NotFoundException when business is not found', async () => {
      (businessRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('999', 'user-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update business and return updated result', async () => {
      (businessRepository.findOne as jest.Mock).mockResolvedValue({ ...mockBusiness });
      const updated = { ...mockBusiness, name: 'New Name Corp' };
      (businessRepository.save as jest.Mock).mockResolvedValue(updated);

      const result = await service.update('biz-1', 'user-1', { name: 'New Name Corp' } as never);

      expect(result.name).toBe('New Name Corp');
    });

    it('should throw NotFoundException when business does not exist', async () => {
      (businessRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.update('999', 'user-1', {} as never)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft remove a business', async () => {
      (businessRepository.findOne as jest.Mock).mockResolvedValue(mockBusiness);
      (businessRepository.softRemove as jest.Mock).mockResolvedValue(mockBusiness);

      await service.remove('biz-1', 'user-1');

      expect(businessRepository.softRemove).toHaveBeenCalledWith(mockBusiness);
    });

    it('should throw NotFoundException when business does not exist', async () => {
      (businessRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.remove('999', 'user-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('addDocument', () => {
    it('should add a document to a business', async () => {
      (businessRepository.findOne as jest.Mock).mockResolvedValue(mockBusiness);
      (documentRepository.create as jest.Mock).mockReturnValue(mockDocument);
      (documentRepository.save as jest.Mock).mockResolvedValue(mockDocument);

      const result = await service.addDocument('biz-1', 'user-1', {
        documentType: 'policy',
        title: 'Privacy Policy',
      });

      expect(documentRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ businessId: 'biz-1', uploadedBy: 'user-1', title: 'Privacy Policy' }),
      );
      expect(result).toEqual(mockDocument);
    });
  });

  describe('getDocuments', () => {
    it('should return documents for a business', async () => {
      (businessRepository.findOne as jest.Mock).mockResolvedValue(mockBusiness);
      (documentRepository.find as jest.Mock).mockResolvedValue([mockDocument]);

      const result = await service.getDocuments('biz-1', 'user-1');

      expect(documentRepository.find).toHaveBeenCalledWith({ where: { businessId: 'biz-1' } });
      expect(result).toHaveLength(1);
    });
  });
});
