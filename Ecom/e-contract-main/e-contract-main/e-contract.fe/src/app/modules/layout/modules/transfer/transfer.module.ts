import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbActiveModal, NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TransferRoutingModule } from './transfer-routing.module';
import { UploadFileModule } from '../../shared/components/upload-file/upload-file.module';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { InputNumberModule } from 'primeng/inputnumber';
import { ZoomeImageModule } from '../../shared/components/zoom-image/zoom-image.module';
import { ModalCreateEditTransferComponent } from './modal-create-edit-transfer/modal-create-edit-transfer.component';
import { TransferListComponent } from './transfer-list/transfer-list.component';
import { SharedModule } from '../../shared.module';
@NgModule({
  declarations: [
    TransferListComponent,
    ModalCreateEditTransferComponent
  ],
  imports: [
    CommonModule,
    TransferRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    UploadFileModule,
    DropdownModule,
    BsDatepickerModule.forRoot(),
    InputTextModule,
    InputNumberModule,
    ZoomeImageModule,
    SharedModule,
    PaginationModule.forRoot()
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    NgbActiveModal
  ]
})
export class TransferModule { }
