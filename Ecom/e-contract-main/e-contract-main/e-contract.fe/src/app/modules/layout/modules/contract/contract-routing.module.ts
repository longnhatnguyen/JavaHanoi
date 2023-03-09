import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/services/auth.guard';
import { ContractManagementComponent } from './contract-management/contract-management.component';
import { ContractTransferComponent } from './contract-transfer/contract-transfer.component';
import { ProofOfEcontractComponent } from './proof-of-econtract/proof-of-econtract.component';

const routes: Routes = [
  {
    path: '',
    children:
      [
        {
          path: '',
          redirectTo: '/contract/contract-management',
          pathMatch: 'full',
        },
        {
          path: 'contract-management',
          component: ContractManagementComponent,
        },
        {
          path: 'contract-transfer/:id',
          component: ContractTransferComponent,
          // canActivate: [AuthGuard],
          // data: {
          //   code: 'CONTRACT',
          //   permission: ['admin']
          // },
        },
        {
          path: 'proof-of-econtract',
          component: ProofOfEcontractComponent,
        }
      ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractRoutingModule { }
