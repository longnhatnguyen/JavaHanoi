import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbActiveModal, NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { ModalCreateEditCustomerComponent } from './customer/modal-create-edit-customer/modal-create-edit-customer.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { UploadFileModule } from '../../shared/components/upload-file/upload-file.module';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { InputNumberModule } from 'primeng/inputnumber';
import { ZoomeImageModule } from '../../shared/components/zoom-image/zoom-image.module';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '../../shared.module';
// import { InvitedCustomerListComponent } from './customer/invited-customer-list/invited-customer-list.component';
@NgModule({
  declarations: [
    CustomerListComponent,
    ModalCreateEditCustomerComponent,
    ProfileComponent,
    // InvitedCustomerListComponent,
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
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
export class CustomerModule { }
