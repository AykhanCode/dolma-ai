import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from '../../modules/businesses/entities/business.entity';

@Injectable()
export class BusinessGuard implements CanActivate {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const businessId = request.params?.businessId ?? request.params?.id;

    if (!businessId) return true;

    const business = await this.businessRepository.findOne({ where: { id: businessId } });
    if (!business) throw new NotFoundException('Business not found');
    if (business.ownerId !== user.id) {
      throw new ForbiddenException('You do not have access to this business');
    }

    request.business = business;
    return true;
  }
}
