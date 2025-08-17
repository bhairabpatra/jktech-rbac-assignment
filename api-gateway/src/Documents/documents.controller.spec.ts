import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './documents.controller';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';

describe('DocumentsController - Happy Path', () => {
  let controller: DocumentsController;
  let documentClient: ClientProxy;

  const mockDocumentClient = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        {
          provide: 'DOCUMENT_SERVICE',
          useValue: mockDocumentClient,
        },
      ],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
    documentClient = module.get<ClientProxy>('DOCUMENT_SERVICE');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDocument', () => {
    it('should successfully retrieve a document by ID', async () => {
      // Arrange
      const documentId = 'doc123';
      const mockResponse = {
        id: 'doc123',
        fileName: 'retrieved-document.pdf',
        mimeType: 'application/pdf',
        fileSize: 2048,
        description: 'Retrieved document',
        userID: 'user123',
        createdAt: '2023-01-01T00:00:00Z',
      };

      mockDocumentClient.send.mockReturnValue(of(mockResponse));

      // Act
      const result = await controller.getDocument(documentId);

      // Assert
      expect(mockDocumentClient.send).toHaveBeenCalledWith(
        { cmd: 'document_get' },
        { id: documentId },
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getAllDocuments', () => {
    it('should successfully retrieve all documents', async () => {
      // Arrange
      const mockResponse = {
        documents: [
          {
            id: 'doc1',
            fileName: 'document1.pdf',
            mimeType: 'application/pdf',
            fileSize: 1024,
          },
          {
            id: 'doc2',
            fileName: 'document2.docx',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            fileSize: 2048,
          },
        ],
        total: 2,
      };

      mockDocumentClient.send.mockReturnValue(of(mockResponse));

      // Act
      const result = await controller.getAllDocuments();

      // Assert
      expect(mockDocumentClient.send).toHaveBeenCalledWith(
        { cmd: 'document_list' },
        {},
      );
      expect(result).toEqual(mockResponse);
    });

    it('should successfully retrieve empty document list', async () => {
      // Arrange
      const mockResponse = {
        documents: [],
        total: 0,
      };

      mockDocumentClient.send.mockReturnValue(of(mockResponse));

      // Act
      const result = await controller.getAllDocuments();

      // Assert
      expect(mockDocumentClient.send).toHaveBeenCalledWith(
        { cmd: 'document_list' },
        {},
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteDocument', () => {
    it('should successfully delete a document by ID', async () => {
      // Arrange
      const documentId = 'doc123';
      const mockResponse = {
        id: 'doc123',
        message: 'Document deleted successfully',
        status: 'deleted',
      };

      mockDocumentClient.send.mockReturnValue(of(mockResponse));

      // Act
      const result = await controller.deleteDocument(documentId);

      // Assert
      expect(mockDocumentClient.send).toHaveBeenCalledWith(
        { cmd: 'delete_document' },
        { id: documentId },
      );
      expect(result).toEqual(mockResponse);
    });
  });

 
});