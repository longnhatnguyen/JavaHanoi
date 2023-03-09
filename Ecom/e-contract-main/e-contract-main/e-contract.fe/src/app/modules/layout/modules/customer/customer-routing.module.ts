import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/services/auth.guard';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
// import { InvitedCustomerListComponent } from './customer/invited-customer-list/invited-customer-list.component';
import { ModalCreateEditCustomerComponent } from './customer/modal-create-edit-customer/modal-create-edit-customer.component';

const routes: Routes = [
  {
    path: '',
    children:
      [
        {
          path: '',
          // canActivate: [AuthGuard],
          // data: {
          //   code: 'QUANLYKHACHHANG',
          //   permission: ['admin']
          // },
          component: CustomerListComponent,
        },
        // {
        //   path: 'invited-list',
        //   component: InvitedCustomerListComponent,
        // },
        {
          path: 'detail/:id',
          component: ModalCreateEditCustomerComponent,
        },
      ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
