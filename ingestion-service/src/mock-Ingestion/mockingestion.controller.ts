import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { MockIngestionService } from './mockingestion.service';

@Controller()
export class MockIngestionController {
  constructor(private readonly mockService: MockIngestionService) {}

  @EventPattern('ingestion_start')
  startIngestion(data: { documentId: string }) {
    return this.mockService.startIngestion(data.documentId);
  }

  @MessagePattern({ cmd: 'ingestion_status' })
  getStatus(data: { documentId: string }) {
    return this.mockService.getStatus(data.documentId);
  }
}
