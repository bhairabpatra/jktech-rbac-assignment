/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


import { UsersService } from 'src/user/users.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Role } from 'src/enums/role.enum';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new BadRequestException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.usersService.create({
      ...dto,
      password: hashed,
      role: dto.role ?? Role.Viewer,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    delete (user as any).password;
    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const payload = { sub: user.id, email: user.email, name: user.name, role: user.role };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id },
      { expiresIn: '7d' },
    );
    
    const hashedRefresh = await bcrypt.hash(refreshToken, SALT_ROUNDS);
    await this.usersService.setCurrentHashedRefreshToken(
      user.id,
      hashedRefresh,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string) {
    await this.usersService.removeRefreshToken(userId); // set currentHashedRefreshToken = null
  }

  async findAllUsers() {
    return await this.usersService.findAll();
  }

  async updateRole(id: string, role: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await this.usersService.updateRole(id, role);
    return { message: `User role updated to ${role}` };
  }
}
