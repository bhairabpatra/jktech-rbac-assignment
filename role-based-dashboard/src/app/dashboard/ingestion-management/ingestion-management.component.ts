import { Component } from '@angular/core';
import { DocumentService } from '../../core/services/document.service';
import { TokenService } from '../../core/services/token.service';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-ingestion-management',
  standalone: true,
  imports: [FormsModule,
    NgIf,
    NgFor,
    RouterLink,
    RouterLinkActive,
    NgClass,
    HttpClientModule,],
  templateUrl: './ingestion-management.component.html',
  styleUrl: './ingestion-management.component.css',
})
export class IngestionManagementComponent {
  public ingestionStatus: any[] = [];

  constructor(
    private documentService: DocumentService,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    this.loadIngestionStatus();
  }

  public loadIngestionStatus() {
    this.documentService.getDocuments().subscribe({
      next: (status: any) => {
        this.ingestionStatus = status;
      },
      error: (err: any) => console.error('Error loading status', err),
    });
  }
}
