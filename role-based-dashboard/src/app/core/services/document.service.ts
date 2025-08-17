// src/app/services/document.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private apiUrl = 'http://localhost:3000/documents';

  constructor(private http: HttpClient) {}

  uploadDocument(
    file: File,
    description: string,
    userID: string
  ): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    formData.append('userID', userID);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  getDocuments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteDocument(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
