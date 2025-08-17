/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
export type IngestionState = 'Processing' | 'Completed' | 'Failed';

@Injectable()
export class MockIngestionService {
  constructor(
    @Inject('DOCUMENT_SERVICE') private readonly documentClient: ClientProxy,
  ) {}
  private statuses: Record<string, string> = {};

  startIngestion(documentId: string) {
    this.statuses[documentId] = 'Processing';
    console.log(`Ingestion started for ${documentId}`);

    setTimeout(() => {
      const finalStatus = Math.random() > 0.2 ? 'Completed' : 'Failed';
      this.statuses[documentId] = finalStatus;

      console.log(
        `Ingestion completed for ${documentId} with status: ${finalStatus}`,
      );

      this.documentClient.emit('ingestion_completed', {
        documentId,
        status: finalStatus,
      });
    }, 3000);
  }

  getStatus(documentId: string) {
    return { documentId, status: this.statuses[documentId] || 'Processing' };
  }
}
