import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/user/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'your-secret-key', // Use process.env.JWT_SECRET in real apps
      signOptions: { expiresIn: '1h' }, // Token expires in 1 hour
    }),
  ], // ✅ register repository here
  providers: [UsersService, AuthService],
  controllers: [UsersController],
})
export class UsersModule {}
