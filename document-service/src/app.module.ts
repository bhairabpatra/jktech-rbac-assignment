import { DocumentsModule } from './documents/documents.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Documents } from './documents/Entity/documentuser.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost', // since MySQL is exposed on localhost
      port: 3306,
      username: 'root',
      password: 'rootpass',
      database: 'userdb',
      entities: [Documents],
      autoLoadEntities: true, // automatically load entity classes
      synchronize: true, // DO NOT use true in production
    }),
    DocumentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
