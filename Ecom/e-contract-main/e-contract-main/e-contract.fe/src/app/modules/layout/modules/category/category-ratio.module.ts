import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CategoryRatioRoutingModule } from './category-ratio-routing.module';
import { CategoryRatioListComponent } from './category-ratio/category-ratio-list/category-ratio-list.component';
import { ModalCreateModifyCategoryRatioComponent } from './category-ratio/modal-create-modify-category-ratio/modal-create-modify-category-ratio.component';
import { CategoryStoreListComponent } from './category-store/category-store-list/category-store-list.component';
import { ModalCreateModifyCategoryStoreComponent } from './category-store/modal-create-modify-category-store/modal-create-modify-category-store.component';
import { UploadFileModule } from '../../shared/components/upload-file/upload-file.module';
import { AddLocationMapModule } from '../../shared/components/add-location-map/add-location-map.module';
import { ViewDetailCategoryStoreComponent } from './category-store/view-detail-category-store/view-detail-category-store.component';
import { InputTextModule } from 'primeng/inputtext';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { BusinessInfoListComponent } from './business-info/business-info-list/business-info-list.component';
import { BusinessInfoModalComponent } from './business-info/business-info-modal/business-info-modal.component';
import { CalendarModule } from 'primeng/calendar';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    CategoryRatioListComponent,
    ModalCreateModifyCategoryRatioComponent,
    CategoryStoreListComponent,
    ModalCreateModifyCategoryStoreComponent,
    ViewDetailCategoryStoreComponent,
    BusinessInfoListComponent,
    BusinessInfoModalComponent,
  ],
  imports: [
    CommonModule,
    CategoryRatioRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    UploadFileModule,
    AddLocationMapModule,
    InputTextModule,
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    InputNumberModule,
    DropdownModule,
    SharedModule,
    InputTextareaModule,
    CalendarModule,
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
export class CategoryRatioModule { }
