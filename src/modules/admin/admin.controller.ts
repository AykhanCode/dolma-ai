import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../core/guards/jwt.guard';
import { AdminGuard } from '../../shared/guards/admin.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Patch('users/:id/suspend')
  suspendUser(@Param('id') id: string) {
    return this.adminService.suspendUser(id);
  }

  @Patch('users/:id/unsuspend')
  unsuspendUser(@Param('id') id: string) {
    return this.adminService.unsuspendUser(id);
  }

  @Get('businesses')
  getAllBusinesses() {
    return this.adminService.getAllBusinesses();
  }

  @Get('stats')
  getSystemStats() {
    return this.adminService.getSystemStats();
  }
}
