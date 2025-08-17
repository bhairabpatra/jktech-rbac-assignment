/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import {
  Controller,
} from '@nestjs/common';
import { join } from 'path';
import { DocumentsService } from './documents.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

@Controller()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @MessagePattern({ cmd: 'document_create' })
  async uploadDocument(@Payload() payload: any) {
    const { fileName, mimeType, fileSize, buffer, description,userID, tags } = payload;
    const uploadDir = join(process.cwd(), 'uploads');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
    const uniqueName = `${Date.now()}-${fileName}`;
    const filePath = join(uploadDir, uniqueName);
    writeFileSync(filePath, Buffer.from(buffer));

    // Save metadata to DB
    return this.documentsService.create({
      fileName,
      filePath,
      mimeType,
      fileSize,
      description,
      userID,
      tags,
    });
  }

  @MessagePattern({ cmd: 'document_get' })
  async getDocument(@Payload() payload: { id: string }) {
    return this.documentsService.getDocumentStatus(payload.id);
  }

  @MessagePattern({ cmd: 'document_list' })
  async getAllDocuments() {
    return this.documentsService.findAll();
  }

  @MessagePattern({ cmd: 'delete_document' })
  async doDeleteDocuments(@Payload() payload: { id: string }) {
    return this.documentsService.remove(payload.id);
  }

  @EventPattern('ingestion_completed')
  async handleIngestionCompleted(@Payload() data: { documentId: string; status: string }) {
    await this.documentsService.updateDocumentStatus(data.documentId, data.status);
    console.log(`Updated document ${data.documentId} to status ${data.status}`);
  }
}
