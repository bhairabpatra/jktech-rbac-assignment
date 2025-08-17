/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Param, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';

@Controller('ingestion')
@ApiTags('Ingestion management')
export class IngestionController {
   constructor(
     @Inject('INGESTION_SERVICE') private readonly ingestionClient: ClientProxy,
   ) {}

  @Post(':id')
  start(@Param('id') id: string) {
    return lastValueFrom(
      this.ingestionClient.send({ cmd: 'ingestion_start' }, { documentId: id }),
    );
  }

  @Get(':id/status')
  status(@Param('id') id: string) {
    return lastValueFrom(
      this.ingestionClient.send({ cmd: 'ingestion_status' }, { documentId: id }),
    );
  }
}
