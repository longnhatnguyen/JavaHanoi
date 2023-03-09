import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/services/auth.guard';
import { ModalCreateEditTransferComponent } from './modal-create-edit-transfer/modal-create-edit-transfer.component';
import { TransferListComponent } from './transfer-list/transfer-list.component';

const routes: Routes = [
  {
    path: '',
    children:
      [
        {
          path: '',
          component: TransferListComponent,
        },
        {
          path: 'detail/:id',
          component: ModalCreateEditTransferComponent,
        },
      ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferRoutingModule { }
