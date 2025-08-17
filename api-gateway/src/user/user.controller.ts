/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('Users management')
// @UseInterceptors(TransformInterceptor)
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Add user' })
  @Post('add-user')
  async addUser(@Body() createUserDto: CreateUserDto) {
    const response = await lastValueFrom(
      this.userClient.send({ cmd: 'add_user' }, createUserDto),
    );
    return response;
  }

  @Post('login-user')
  async doLogin(@Body() createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const response = await lastValueFrom(
      this.userClient.send({ cmd: 'login_user' }, { email, password }),
    );
    return response;
  }

  @Get('all-user')
  async getUsers() {
    const response = await lastValueFrom(
      this.userClient.send({ cmd: 'get_users' },{}),
    );
    return response;
  }

  @Put(':id/role')
  async updateRole(@Param('id') id: string, @Body('role') role: string) {
    const response = await lastValueFrom(
      this.userClient.send({ cmd: 'update_rolePermissions' },{id, role}),
    );
    return response;
  }
}
