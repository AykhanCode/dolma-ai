import { Test, TestingModule } from '@nestjs/testing';
import { AgentsController } from '../../../modules/agents/agents.controller';
import { AgentsService } from '../../../modules/agents/agents.service';
import { JwtAuthGuard } from '../../../core/guards/jwt.guard';

describe('AgentsController', () => {
  let controller: AgentsController;
  let agentsService: jest.Mocked<Partial<AgentsService>>;

  const mockAgent = {
    id: '1',
    name: 'Support Bot',
    category: 'support',
    status: 'draft',
    businessId: 'biz-1',
  };

  beforeEach(async () => {
    agentsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      deploy: jest.fn(),
      pause: jest.fn(),
      resume: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgentsController],
      providers: [{ provide: AgentsService, useValue: agentsService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AgentsController>(AgentsController);
  });

  describe('create', () => {
    it('should create and return a new agent', async () => {
      (agentsService.create as jest.Mock).mockResolvedValue(mockAgent);

      const result = await controller.create(mockAgent as never);

      expect(agentsService.create).toHaveBeenCalledWith(mockAgent);
      expect(result).toEqual(mockAgent);
    });
  });

  describe('findAll', () => {
    it('should return agents filtered by businessId', async () => {
      (agentsService.findAll as jest.Mock).mockResolvedValue([mockAgent]);

      const result = await controller.findAll('biz-1');

      expect(agentsService.findAll).toHaveBeenCalledWith('biz-1');
      expect(result).toEqual([mockAgent]);
    });

    it('should return all agents when businessId is not provided', async () => {
      (agentsService.findAll as jest.Mock).mockResolvedValue([mockAgent]);

      const result = await controller.findAll(undefined);

      expect(agentsService.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual([mockAgent]);
    });
  });

  describe('findOne', () => {
    it('should return an agent by id', async () => {
      (agentsService.findOne as jest.Mock).mockResolvedValue(mockAgent);

      const result = await controller.findOne('1');

      expect(agentsService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockAgent);
    });
  });

  describe('update', () => {
    it('should update and return the updated agent', async () => {
      const updated = { ...mockAgent, name: 'Updated Bot' };
      (agentsService.update as jest.Mock).mockResolvedValue(updated);

      const result = await controller.update('1', { name: 'Updated Bot' } as never);

      expect(agentsService.update).toHaveBeenCalledWith('1', { name: 'Updated Bot' });
      expect(result.name).toBe('Updated Bot');
    });
  });

  describe('remove', () => {
    it('should remove an agent', async () => {
      (agentsService.remove as jest.Mock).mockResolvedValue(undefined);

      await controller.remove('1');

      expect(agentsService.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('deploy', () => {
    it('should deploy an agent with channel credentials', async () => {
      const deployed = { ...mockAgent, status: 'active', deploymentStatus: 'deployed' };
      (agentsService.deploy as jest.Mock).mockResolvedValue(deployed);

      const result = await controller.deploy('1', { channelCredentials: { apiKey: 'key' } } as never);

      expect(agentsService.deploy).toHaveBeenCalledWith('1', { apiKey: 'key' });
      expect(result.status).toBe('active');
    });
  });

  describe('pause', () => {
    it('should pause an agent', async () => {
      const paused = { ...mockAgent, deploymentStatus: 'paused' };
      (agentsService.pause as jest.Mock).mockResolvedValue(paused);

      const result = await controller.pause('1');

      expect(agentsService.pause).toHaveBeenCalledWith('1');
      expect(result.deploymentStatus).toBe('paused');
    });
  });

  describe('resume', () => {
    it('should resume an agent', async () => {
      const resumed = { ...mockAgent, deploymentStatus: 'deployed' };
      (agentsService.resume as jest.Mock).mockResolvedValue(resumed);

      const result = await controller.resume('1');

      expect(agentsService.resume).toHaveBeenCalledWith('1');
      expect(result.deploymentStatus).toBe('deployed');
    });
  });
});
