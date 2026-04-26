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
import { ContentService } from './content.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { SchedulePostDto } from './dtos/schedule-post.dto';
import { JwtAuthGuard } from '../../core/guards/jwt.guard';

@Controller('content')
@UseGuards(JwtAuthGuard)
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  create(@Body() dto: CreatePostDto) {
    return this.contentService.create(dto);
  }

  @Get()
  findAll(@Query('businessId') businessId?: string) {
    return this.contentService.findAll(businessId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.contentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentService.remove(id);
  }

  @Post(':id/publish')
  publish(@Param('id') id: string) {
    return this.contentService.publish(id);
  }

  @Post(':id/schedule')
  schedule(@Param('id') id: string, @Body() dto: SchedulePostDto) {
    return this.contentService.schedule(id, new Date(dto.scheduledTime));
  }
}
