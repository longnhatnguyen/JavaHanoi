import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractSigningComponent } from './contract-signing/contract-signing.component';

const routes: Routes = [
  {
    path: '',
    children:
      [
        {
          path: '',
          redirectTo: '/contract-signing/0',
          pathMatch: 'full',
        },
        {
          path: ':id',
          component: ContractSigningComponent,
        },
      ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractRegistrationRoutingModule { }
