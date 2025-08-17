import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';
import { IngestionController } from './ingestion.controller';

describe('IngestionController', () => {
  let controller: IngestionController;
  let ingestionClient: ClientProxy;

  const mockIngestionClient = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        {
          provide: 'INGESTION_SERVICE',
          useValue: mockIngestionClient,
        },
      ],
    }).compile();

    controller = module.get<IngestionController>(IngestionController);
    ingestionClient = module.get<ClientProxy>('INGESTION_SERVICE');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('start', () => {
    it('should successfully start ingestion for a document', async () => {
      // Arrange
      const documentId = 'doc-123';
      const expectedResponse = { 
        success: true, 
        message: 'Ingestion started', 
        documentId: documentId 
      };
      
      mockIngestionClient.send.mockReturnValue(of(expectedResponse));

      // Act
      const result = await controller.start(documentId);

      // Assert
      expect(mockIngestionClient.send).toHaveBeenCalledWith(
        { cmd: 'ingestion_start' },
        { documentId: documentId }
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should handle different document IDs correctly', async () => {
      // Arrange
      const documentId = 'different-doc-456';
      const expectedResponse = { 
        success: true, 
        jobId: 'job-789',
        documentId: documentId 
      };
      
      mockIngestionClient.send.mockReturnValue(of(expectedResponse));

      // Act
      const result = await controller.start(documentId);

      // Assert
      expect(mockIngestionClient.send).toHaveBeenCalledWith(
        { cmd: 'ingestion_start' },
        { documentId: documentId }
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('status', () => {
    it('should successfully get ingestion status for a document', async () => {
      // Arrange
      const documentId = 'doc-123';
      const expectedResponse = { 
        documentId: documentId,
        status: 'processing',
        progress: 75,
        startedAt: '2024-01-01T10:00:00Z'
      };
      
      mockIngestionClient.send.mockReturnValue(of(expectedResponse));

      // Act
      const result = await controller.status(documentId);

      // Assert
      expect(mockIngestionClient.send).toHaveBeenCalledWith(
        { cmd: 'ingestion_status' },
        { documentId: documentId }
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should handle completed status correctly', async () => {
      // Arrange
      const documentId = 'completed-doc-789';
      const expectedResponse = { 
        documentId: documentId,
        status: 'completed',
        progress: 100,
        startedAt: '2024-01-01T10:00:00Z',
        completedAt: '2024-01-01T11:00:00Z'
      };
      
      mockIngestionClient.send.mockReturnValue(of(expectedResponse));

      // Act
      const result = await controller.status(documentId);

      // Assert
      expect(mockIngestionClient.send).toHaveBeenCalledWith(
        { cmd: 'ingestion_status' },
        { documentId: documentId }
      );
      expect(result).toEqual(expectedResponse);
    });
  });
});

