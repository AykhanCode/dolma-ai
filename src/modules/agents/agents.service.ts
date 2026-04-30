import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from './entities/agent.entity';
import { CreateAgentDto } from './dtos/create-agent.dto';
import { UpdateAgentDto } from './dtos/update-agent.dto';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
  ) {}

  async create(dto: CreateAgentDto): Promise<Agent> {
    const agent = this.agentRepository.create(dto);
    return this.agentRepository.save(agent);
  }

  async findAll(businessId?: string): Promise<Agent[]> {
    const where = businessId ? { businessId } : {};
    return this.agentRepository.find({ where });
  }

  async findOne(id: string): Promise<Agent> {
    const agent = await this.agentRepository.findOne({ where: { id } });
    if (!agent) throw new NotFoundException('Agent not found');
    return agent;
  }

  async update(id: string, dto: UpdateAgentDto): Promise<Agent> {
    const agent = await this.findOne(id);
    Object.assign(agent, dto);
    return this.agentRepository.save(agent);
  }

  async deploy(id: string, channelCredentials?: any): Promise<Agent> {
    const agent = await this.findOne(id);
    agent.deploymentStatus = 'deployed';
    agent.status = 'active';
    if (channelCredentials) agent.channelCredentials = channelCredentials;
    return this.agentRepository.save(agent);
  }

  async pause(id: string): Promise<Agent> {
    const agent = await this.findOne(id);
    agent.deploymentStatus = 'paused';
    return this.agentRepository.save(agent);
  }

  async resume(id: string): Promise<Agent> {
    const agent = await this.findOne(id);
    agent.deploymentStatus = 'deployed';
    return this.agentRepository.save(agent);
  }

  async remove(id: string): Promise<void> {
    const agent = await this.findOne(id);
    await this.agentRepository.softRemove(agent);
  }
}
