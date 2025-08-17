import { NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DocumentUploadComponent } from '../../features/document-upload/document-upload.component';

@Component({
  selector: 'app-create-content',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, RouterLink, RouterLinkActive,HttpClientModule,DocumentUploadComponent ],
  templateUrl: './create-content.component.html',
  styleUrl: './create-content.component.css'
})
export class CreateContentComponent {

}
