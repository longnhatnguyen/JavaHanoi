import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleriaModule } from 'primeng/galleria';
import { ZoomImageComponent } from './zoom-image.component';

@NgModule({
  declarations: [ZoomImageComponent],
  imports: [
    CommonModule,
    GalleriaModule
  ],
  exports: [ZoomImageComponent],
})
export class ZoomeImageModule { }
