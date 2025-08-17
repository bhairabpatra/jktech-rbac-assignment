import { Component } from '@angular/core';
import { DocumentUploadComponent } from '../../features/document-upload/document-upload.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TokenService } from '../../core/services/token.service';
import { DocumentService } from '../../core/services/document.service';

@Component({
  selector: 'app-view-content',
  standalone: true,

  imports: [
    FormsModule,
    NgIf,
    NgFor,
    RouterLink,
    RouterLinkActive,
    HttpClientModule,
    DocumentUploadComponent,
  ],
  templateUrl: './view-content.component.html',
  styleUrl: './view-content.component.css',
})
export class ViewContentComponent {
  selectedFile: File | null = null;
  description = '';
  isUploading = false;
  documents: any[] = [];
  role?: string = 'viewer'; // set based on logged-in user

  private apiUrl = 'http://localhost:3000/documents';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private documentService: DocumentService
  ) {}

  ngOnInit() {
    this.loadDocuments();
    const role = this.tokenService.getRoles()[0]?.toLowerCase();
    this.role = role;
  }

  loadDocuments() {
    this.documentService.getDocuments().subscribe({
      next: (docs) => (this.documents = docs),
      error: (err) => console.error('Error loading documents', err),
    });
  }

  viewDocument(doc: any) {
    this.selectedFile = doc.fileName;
    this.description = doc.description;
    alert(
      'VIEW  LOGIC WILL GOES HERE ' +
        this.selectedFile +
        '   ' +
        this.description
    );
  }

  downloadDocument(doc: any) {
    this.selectedFile = doc.fileName;
    this.description = doc.description;
    alert(
      'DOWNLOAD  LOGIC WILL GOES HERE ' +
        this.selectedFile +
        '   ' +
        this.description
    );
  }

  editDocument(doc: any) {
    this.selectedFile = doc.fileName;
    this.description = doc.description;
    alert(
      'EDIT LOGIC WILL GOES HERE ' +
        this.selectedFile +
        '   ' +
        this.description
    );
  }

  deleteDocument(doc: any) {
    this.selectedFile = doc.fileName;
    this.documentService.deleteDocument(doc.id).subscribe({
      next: (response: any) => {
        const { message } = response;
        alert(this.selectedFile + " => " + message);
        this.documents = this.documents.filter((d) => d.id !== doc.id);
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }
}
