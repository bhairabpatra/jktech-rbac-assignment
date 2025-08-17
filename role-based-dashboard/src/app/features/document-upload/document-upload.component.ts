import { NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DocumentService } from '../../core/services/document.service';
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgFor,
    RouterLink,
    RouterLinkActive,
    HttpClientModule,
  ],
  templateUrl: './document-upload.component.html',
  styleUrl: './document-upload.component.css',
})
export class DocumentUploadComponent {
  selectedFile: File | null = null;
  description = '';
  isUploading = false;
  documents: any[] = [];
  userID: string | undefined;
  roles: string | undefined;
  constructor(
    private documentService: DocumentService,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    this.loadDocuments();
    this.tokenService.payload$.subscribe((stateValues) => {
      this.userID = stateValues?.email || '';
      this.roles = stateValues?.['role'] || '';
    });
    const roles =  this.tokenService.getRoles();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }

  uploadDocument() {
    if (!this.selectedFile) {
      alert('Please select a file first.');
      return;
    }

    this.isUploading = true;

    this.documentService
      .uploadDocument(this.selectedFile, this.description, this.userID || '')
      .subscribe({
        next: (value) => {
          this.isUploading = false;
          this.description = '';
          this.selectedFile = null;
          this.loadDocuments();
        },
        error: (err: any) => {
          console.error(err);
          alert('Upload failed.');
          this.isUploading = false;
        },
      });
  }


  loadDocuments() {
    this.documentService.getDocuments().subscribe({
      next: (docs: any) => {
        this.documents = docs.filter((value: any) => {
              if(this.roles?.includes('Editor')) {
                return value.userID === this.userID 
              }else{
                return docs
              }
        })},
      error: (err: any) => console.error('Error loading documents', err),
    });
  }
}
