import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './user/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql',
      port: 3306,
      username: 'root',
      password: 'rootpass',
      database: 'userdb',
      entities: [User],
      autoLoadEntities: true, // automatically load entity classes
      synchronize: true, // DO NOT use true in production
    }),

    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
