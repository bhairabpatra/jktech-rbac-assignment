// src/app/services/document.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DocumentService } from './document.service';

describe('DocumentService', () => {
  let service: DocumentService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3000/documents';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DocumentService]
    });
    
    service = TestBed.inject(DocumentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('uploadDocument', () => {
    it('should upload a document with correct FormData', () => {
      // Arrange
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
      const description = 'Test document';
      const userID = 'user123';
      const mockResponse = { id: '1', message: 'Document uploaded successfully' };

      // Act
      service.uploadDocument(mockFile, description, userID).subscribe(response => {
        // Assert
        expect(response).toEqual(mockResponse);
      });

      // Assert HTTP request
      const req = httpMock.expectOne(`${apiUrl}/upload`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeInstanceOf(FormData);
      
      // Verify FormData contents
      const formData = req.request.body as FormData;
      expect(formData.get('file')).toBe(mockFile);
      expect(formData.get('description')).toBe(description);
      expect(formData.get('userID')).toBe(userID);

      req.flush(mockResponse);
    });
  });

  describe('getDocuments', () => {
    it('should retrieve all documents', () => {
      // Arrange
      const mockDocuments = [
        { id: '1', name: 'document1.pdf', description: 'First document', userID: 'user123' },
        { id: '2', name: 'document2.docx', description: 'Second document', userID: 'user456' }
      ];

      // Act
      service.getDocuments().subscribe(documents => {
        // Assert
        expect(documents).toEqual(mockDocuments);
        expect(documents.length).toBe(2);
      });

      // Assert HTTP request
      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockDocuments);
    });

    it('should return empty array when no documents exist', () => {
      // Arrange
      const mockDocuments: any[] = [];

      // Act
      service.getDocuments().subscribe(documents => {
        // Assert
        expect(documents).toEqual([]);
        expect(documents.length).toBe(0);
      });

      // Assert HTTP request
      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockDocuments);
    });

    it('should handle get documents error', () => {
      // Act & Assert
      service.getDocuments().subscribe({
        next: () => fail('Expected an error'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document by id', () => {
      // Arrange
      const documentId = '123';
      const mockResponse = { message: 'Document deleted successfully' };

      // Act
      service.deleteDocument(documentId).subscribe(response => {
        // Assert
        expect(response).toEqual(mockResponse);
      });

      // Assert HTTP request
      const req = httpMock.expectOne(`${apiUrl}/${documentId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('HTTP request parameters', () => {
    it('should use correct API URL for all endpoints', () => {
      // Test upload endpoint
      const mockFile = new File(['test'], 'test.pdf');
      service.uploadDocument(mockFile, 'desc', 'user123').subscribe();
      const uploadReq = httpMock.expectOne(`${apiUrl}/upload`);
      uploadReq.flush({});

      // Test get endpoint
      service.getDocuments().subscribe();
      const getReq = httpMock.expectOne(apiUrl);
      getReq.flush([]);

      // Test delete endpoint
      service.deleteDocument('123').subscribe();
      const deleteReq = httpMock.expectOne(`${apiUrl}/123`);
      deleteReq.flush({});
    });
  });
});