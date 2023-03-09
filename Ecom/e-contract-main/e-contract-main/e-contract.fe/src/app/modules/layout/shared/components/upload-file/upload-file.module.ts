import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadFileComponent } from './upload-file.component';
import { GalleriaModule } from 'primeng/galleria';

@NgModule({
  declarations: [UploadFileComponent],
  imports: [
    CommonModule,
    GalleriaModule
  ],
  exports: [UploadFileComponent],
})
export class UploadFileModule { }
