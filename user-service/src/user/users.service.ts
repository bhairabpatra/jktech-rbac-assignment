/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  async findAll(): Promise<User[] | null> {
    return this.usersRepo.find();
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.usersRepo.create(dto);
    return this.usersRepo.save(user);
  }

  async setCurrentHashedRefreshToken(
    userId: string,
    hashedToken: string,
  ): Promise<void> {
    await this.usersRepo.update(userId, {
      currentHashedRefreshToken: hashedToken,
    });
  }

  async removeRefreshToken(userId: string): Promise<void> {
    await this.usersRepo.update(userId, { currentHashedRefreshToken: null });
  }

  async updateRole(id: string, role: Role): Promise<{ message: string }> {
    await this.usersRepo.update(id, { role });
    return { message: `User role updated to ${role}` };
  }
}
