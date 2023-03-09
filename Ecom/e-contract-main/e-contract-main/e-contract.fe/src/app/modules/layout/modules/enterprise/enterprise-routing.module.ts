import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnterpriseIntroComponent } from './enterprise-intro/enterprise-intro.component';
import { EnterpriseOrganizationalStructureComponent } from './enterprise-organizational-structure/enterprise-organizational-structure.component';

const routes: Routes = [
  {
    path: '',
    children:
      [
        {
          path: '',
          redirectTo: '/enterprise/enterprise-intro',
          pathMatch: 'full',
        },
        {
          path: 'enterprise-intro',
          component: EnterpriseIntroComponent,
        },
        {
          path: 'enterprise-organizational-structure',
          component: EnterpriseOrganizationalStructureComponent,
        }
      ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnterpriseRoutingModule { }
