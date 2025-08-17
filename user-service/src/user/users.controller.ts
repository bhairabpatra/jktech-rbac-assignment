import { Controller, Get, UseGuards } from '@nestjs/common';

import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from 'src/user/auth.service';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('')
export class UsersController {
  constructor(private readonly usersService: AuthService) {}

  @MessagePattern({ cmd: 'add_user' })
  async addUser(@Payload() data: CreateUserDto) {
    return await this.usersService.register(data);
  }

  @MessagePattern({ cmd: 'login_user' })
  async loginUser(@Payload() data: CreateUserDto) {
    return await this.usersService.login(data.email, data.password);
  }

  @MessagePattern({ cmd: 'get_users' })
  async getAllUser() {
    return await this.usersService.findAllUsers();
  }

  @MessagePattern({ cmd: 'update_rolePermissions' })
  async updateRolePermissions(@Payload() data: any) {
    return await this.usersService.updateRole(data.id, data.role);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get('admin-only')
  adminOnly() {
    return { ok: true, message: 'only admins' };
  }
}
