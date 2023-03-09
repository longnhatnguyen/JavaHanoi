import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserComponent } from './user/user.component';
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';
import { ModalCreateEditComponent } from './user/modal-create-edit/modal-create-edit.component';

import { GroupComponent } from './group/group.component';
import { ModalCreateEditGroupComponent } from './group/modal-create-edit-group/modal-create-edit-group.component';

import { ModalCreateEditGroupRoleComponent } from './modal-create-edit-group-role/modal-create-edit-group-role.component';
import { ModalCreateEditRoleGroupComponent } from './modal-create-edit-role-group/modal-create-edit-role-group.component';
import { ModalCreateEditGroupUserComponent } from './modal-create-edit-group-user/modal-create-edit-group-user.component';

import { RoleComponent } from './role/role.component';
import { ModalCreateEditRoleComponent } from './role/modal-create-edit-role/modal-create-edit-role.component';
import { NgbActiveModal, NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InputTextModule } from 'primeng/inputtext';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { UploadFileModule } from '../../shared/components/upload-file/upload-file.module';
import { ZoomeImageModule } from '../../shared/components/zoom-image/zoom-image.module';
import { ModalCreateModifyGroupRoleComponent } from './modal-create-modify-group-role/modal-create-modify-group-role.component';
import {AccordionModule} from 'primeng/accordion';
@NgModule({
  declarations: [
    UserComponent,
    ModalCreateEditComponent,
    ForgotPasswordComponent,
    GroupComponent,
    ModalCreateEditGroupComponent,
    RoleComponent,
    ModalCreateEditRoleComponent,
    ModalCreateEditRoleGroupComponent,
    ModalCreateEditRoleGroupComponent,
    ModalCreateEditGroupRoleComponent,
    ModalCreateEditGroupUserComponent,
    ModalCreateModifyGroupRoleComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    UploadFileModule,
    BsDatepickerModule.forRoot(),
    InputTextModule,
    ZoomeImageModule,
    AccordionModule,
    PaginationModule.forRoot(),
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
export class UserModule { }
