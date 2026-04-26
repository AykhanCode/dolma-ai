import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dtos/create-agent.dto';
import { UpdateAgentDto } from './dtos/update-agent.dto';
import { DeployAgentDto } from './dtos/deploy-agent.dto';
import { JwtAuthGuard } from '../../core/guards/jwt.guard';

@Controller('agents')
@UseGuards(JwtAuthGuard)
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  create(@Body() dto: CreateAgentDto) {
    return this.agentsService.create(dto);
  }

  @Get()
  findAll(@Query('businessId') businessId?: string) {
    return this.agentsService.findAll(businessId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agentsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAgentDto) {
    return this.agentsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agentsService.remove(id);
  }

  @Post(':id/deploy')
  deploy(@Param('id') id: string, @Body() dto: DeployAgentDto) {
    return this.agentsService.deploy(id, dto.channelCredentials);
  }

  @Post(':id/pause')
  pause(@Param('id') id: string) {
    return this.agentsService.pause(id);
  }

  @Post(':id/resume')
  resume(@Param('id') id: string) {
    return this.agentsService.resume(id);
  }
}
