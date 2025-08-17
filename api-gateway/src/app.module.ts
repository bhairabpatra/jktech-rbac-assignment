import { IngestionController } from './ingestion/ingestion.controller';
import { DocumentsController } from './Documents/documents.controller';
import { UserController } from './user/user.controller';
/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/exception.filter';
import { AppMiddleware } from './common/middleware/app.middleware';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 3001 },
      },
      {
        name: 'DOCUMENT_SERVICE',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 3002 },
      },
      {
        name: 'INGESTION_SERVICE',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 3003 },
      },
    ]),
  ],
  controllers: [
    IngestionController,
    DocumentsController,
    UserController,
    AppController,
  ],
  providers: [AppService, {
    provide: APP_FILTER,
    useClass: AllExceptionsFilter,
  },],
})
export class AppModule { configure(consumer: MiddlewareConsumer) {
  consumer.apply(AppMiddleware).forRoutes('*'); // apply to all routes
}}
