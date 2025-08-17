/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptor';
import { ApiTags } from '@nestjs/swagger';

@Controller('documents')
@ApiTags('Upload document management')
// @UseInterceptors(TransformInterceptor)
export class DocumentsController {
  constructor(
    @Inject('DOCUMENT_SERVICE') private readonly documentClient: ClientProxy,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    if (!file) {
      throw new BadRequestException(
        'No file uploaded — please send "file" in form-data.',
      );
    }

    const payload = {
      fileName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      buffer: file.buffer,
      description: body.description || null,
      userID: body.userID || null,
    };
    return await lastValueFrom(
      this.documentClient.send({ cmd: 'document_create' }, payload),
    );
  }

  @Get(':id')
  async getDocument(@Param('id') id: string) {
    return await lastValueFrom(
      this.documentClient.send({ cmd: 'document_get' }, { id }),
    );
  }

  @Get()
  async getAllDocuments() {
    return await lastValueFrom(
      this.documentClient.send({ cmd: 'document_list' }, {}),
    );
  }

  @Delete(':id')
  async deleteDocument(@Param('id') id: string) {
    return await lastValueFrom(
      this.documentClient.send({ cmd: 'delete_document' }, { id }),
    );
  }
}
