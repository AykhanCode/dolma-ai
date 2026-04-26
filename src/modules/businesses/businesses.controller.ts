import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dtos/create-business.dto';
import { UpdateBusinessDto } from './dtos/update-business.dto';
import { JwtAuthGuard } from '../../core/guards/jwt.guard';
import { CurrentUser } from '../../core/decorators/current-user.decorator';

@Controller('businesses')
@UseGuards(JwtAuthGuard)
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: CreateBusinessDto) {
    return this.businessesService.create(userId, dto);
  }

  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.businessesService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.businessesService.findOne(id, userId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateBusinessDto,
  ) {
    return this.businessesService.update(id, userId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.businessesService.remove(id, userId);
  }

  @Post(':id/documents')
  addDocument(
    @Param('id') businessId: string,
    @CurrentUser('id') userId: string,
    @Body() body: { documentType: string; title: string; content?: string; fileUrl?: string },
  ) {
    return this.businessesService.addDocument(businessId, userId, body);
  }

  @Get(':id/documents')
  getDocuments(@Param('id') businessId: string, @CurrentUser('id') userId: string) {
    return this.businessesService.getDocuments(businessId, userId);
  }
}
