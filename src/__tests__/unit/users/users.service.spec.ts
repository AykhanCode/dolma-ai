import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersService } from '../../../modules/users/users.service';
import { User } from '../../../modules/users/entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Partial<Repository<User>>>;

  const mockUser: Partial<User> = {
    id: '1',
    email: 'test@example.com',
    passwordHash: 'hashed-password',
    firstName: 'Test',
    lastName: 'User',
    role: 'business_owner',
    status: 'active',
  };

  beforeEach(async () => {
    repository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      softRemove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('findById', () => {
    it('should return a user when found', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findById('1');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user is not found', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findById('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user when found by email', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found by email', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await service.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and save a new user', async () => {
      const userData = {
        email: 'new@example.com',
        passwordHash: 'hash',
        firstName: 'New',
        lastName: 'User',
      };

      (repository.create as jest.Mock).mockReturnValue(userData);
      (repository.save as jest.Mock).mockResolvedValue({ id: '2', ...userData });

      const result = await service.create(userData);

      expect(repository.create).toHaveBeenCalledWith(userData);
      expect(repository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('id', '2');
    });
  });

  describe('update', () => {
    it('should update user and return the updated user', async () => {
      const updatedUser = { ...mockUser, firstName: 'Updated' };

      (repository.findOne as jest.Mock).mockResolvedValue({ ...mockUser });
      (repository.save as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.update('1', { firstName: 'Updated' } as never);

      expect(result.firstName).toBe('Updated');
    });

    it('should throw NotFoundException when updating non-existent user', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.update('999', { firstName: 'Test' } as never)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should soft remove a user', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(mockUser);
      (repository.softRemove as jest.Mock).mockResolvedValue(mockUser);

      await service.remove('1');

      expect(repository.softRemove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException when removing non-existent user', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
