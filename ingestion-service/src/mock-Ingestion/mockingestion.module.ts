/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { MockIngestionService } from './mockingestion.service';
import { MockIngestionController } from './mockingestion.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DOCUMENT_SERVICE',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 3002 },
      },
    ]),
  ],
  controllers: [MockIngestionController],
  providers: [MockIngestionService],
})
export class MockIngestionModule {}
