import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Business } from '../businesses/entities/business.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({ order: { createdAt: 'DESC' } });
  }

  async suspendUser(id: string): Promise<User> {
    const user = await this.userRepository.findOneOrFail({ where: { id } });
    user.status = 'suspended';
    return this.userRepository.save(user);
  }

  async unsuspendUser(id: string): Promise<User> {
    const user = await this.userRepository.findOneOrFail({ where: { id } });
    user.status = 'active';
    return this.userRepository.save(user);
  }

  async getAllBusinesses(): Promise<Business[]> {
    return this.businessRepository.find({ order: { createdAt: 'DESC' } });
  }

  async getSystemStats() {
    const [totalUsers, totalBusinesses] = await Promise.all([
      this.userRepository.count(),
      this.businessRepository.count(),
    ]);

    const suspendedUsers = await this.userRepository.count({ where: { status: 'suspended' } });

    return {
      totalUsers,
      totalBusinesses,
      suspendedUsers,
      activeUsers: totalUsers - suspendedUsers,
      generatedAt: new Date(),
    };
  }
}
