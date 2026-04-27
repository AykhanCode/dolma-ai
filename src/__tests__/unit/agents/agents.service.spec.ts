import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AgentsService } from '../../../modules/agents/agents.service';
import { Agent } from '../../../modules/agents/entities/agent.entity';

describe('AgentsService', () => {
  let service: AgentsService;
  let repository: jest.Mocked<Partial<Repository<Agent>>>;

  const mockAgent: Partial<Agent> = {
    id: '1',
    name: 'Support Bot',
    category: 'support',
    systemPrompt: 'You are a helpful agent',
    status: 'draft',
    deploymentStatus: 'not_deployed',
    businessId: 'biz-1',
    channels: ['whatsapp'],
  };

  beforeEach(async () => {
    repository = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      softRemove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgentsService,
        {
          provide: getRepositoryToken(Agent),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<AgentsService>(AgentsService);
  });

  describe('create', () => {
    it('should create and return a new agent', async () => {
      (repository.create as jest.Mock).mockReturnValue(mockAgent);
      (repository.save as jest.Mock).mockResolvedValue({ id: '1', ...mockAgent });

      const result = await service.create(mockAgent as never);

      expect(repository.create).toHaveBeenCalledWith(mockAgent);
      expect(repository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('id', '1');
    });
  });

  describe('findAll', () => {
    it('should return all agents when no businessId is provided', async () => {
      (repository.find as jest.Mock).mockResolvedValue([mockAgent]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({ where: {} });
      expect(result).toHaveLength(1);
    });

    it('should return agents filtered by businessId', async () => {
      (repository.find as jest.Mock).mockResolvedValue([mockAgent]);

      const result = await service.findAll('biz-1');

      expect(repository.find).toHaveBeenCalledWith({ where: { businessId: 'biz-1' } });
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return an agent when found', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(mockAgent);

      const result = await service.findOne('1');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(mockAgent);
    });

    it('should throw NotFoundException when agent is not found', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update agent and return updated result', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue({ ...mockAgent });
      const updated = { ...mockAgent, name: 'Updated Bot' };
      (repository.save as jest.Mock).mockResolvedValue(updated);

      const result = await service.update('1', { name: 'Updated Bot' } as never);

      expect(result.name).toBe('Updated Bot');
    });

    it('should throw NotFoundException when updating non-existent agent', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.update('999', { name: 'Test' } as never)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deploy', () => {
    it('should deploy agent and set status to active', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue({ ...mockAgent });
      const deployed = { ...mockAgent, status: 'active', deploymentStatus: 'deployed' };
      (repository.save as jest.Mock).mockResolvedValue(deployed);

      const result = await service.deploy('1');

      expect(result.status).toBe('active');
      expect(result.deploymentStatus).toBe('deployed');
    });
  });

  describe('pause', () => {
    it('should pause a deployed agent', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue({ ...mockAgent, deploymentStatus: 'deployed' });
      const paused = { ...mockAgent, deploymentStatus: 'paused' };
      (repository.save as jest.Mock).mockResolvedValue(paused);

      const result = await service.pause('1');

      expect(result.deploymentStatus).toBe('paused');
    });
  });

  describe('resume', () => {
    it('should resume a paused agent', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue({ ...mockAgent, deploymentStatus: 'paused' });
      const resumed = { ...mockAgent, deploymentStatus: 'deployed' };
      (repository.save as jest.Mock).mockResolvedValue(resumed);

      const result = await service.resume('1');

      expect(result.deploymentStatus).toBe('deployed');
    });
  });

  describe('remove', () => {
    it('should soft remove an agent', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(mockAgent);
      (repository.softRemove as jest.Mock).mockResolvedValue(mockAgent);

      await service.remove('1');

      expect(repository.softRemove).toHaveBeenCalledWith(mockAgent);
    });

    it('should throw NotFoundException when removing non-existent agent', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
