/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documents } from './Entity/documentuser.entity';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Documents)
    private readonly documentRepo: Repository<Documents>,
    @Inject('INGESTION_SERVICE')
    private readonly ingestionClient: ClientProxy,
  ) {}

  async create(data) {
    const savedDoc = await this.documentRepo.save(data);
    this.ingestionClient.emit('ingestion_start', { documentId: savedDoc.id });
    return {
      message: 'Document uploaded successfully',
      documentId: savedDoc.id,
      status: savedDoc.status,
    };
  }

  async findOne(id: string) {
    const doc = await this.documentRepo.findOne({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  async findAll() {
    return this.documentRepo.find();
  }

  async update(id: string, updateData) {
    await this.documentRepo.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string) {
    const doc = await this.findOne(id);
    await this.documentRepo.remove(doc);
    return { message: 'Document deleted successfully' };
  }

  async getDocumentStatus(documentId: string) {
    // Query status from DB (optional: you can also query ingestion service)
    const doc = await this.documentRepo.findOne({ where: { id: documentId } });
    if (!doc) {
      return { error: 'Document not found' };
    }
    return { documentId: doc.id, status: doc.status };
  }

  async updateDocumentStatus(documentId: string, status: string) {
    await this.documentRepo.update(documentId, { status });
  }
}
