import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddLocationMapComponent } from './add-location-map.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LocationMapModalComponent } from './location-map-modal/location-map-modal.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [AddLocationMapComponent, LocationMapModalComponent],
  imports: [
    CommonModule,
    ModalModule,
    FormsModule,
  ],
  exports: [
    AddLocationMapComponent, LocationMapModalComponent
  ]
})
export class AddLocationMapModule { }
