import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/services/auth.guard';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        canLoad: [AuthGuard],
        data: {
          code: 'DASHBOARD',
          permission: ['customer', 'admin']
        },
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'user',
        canLoad: [AuthGuard],
        data: {
          code: 'ADMIN',
          permission: ['admin']
        },
        loadChildren: () =>
          import('./modules/user/user.module').then((m) => m.UserModule),
      },
      {
        path: 'customer',
        canLoad: [AuthGuard],
        data: {
          code: 'CUSTOMER',
          permission: ['admin', 'customer']
        },
        loadChildren: () =>
          import('./modules/customer/customer.module').then((m) => m.CustomerModule),
      },
      {
        path: 'transfer',
        canLoad: [AuthGuard],
        data: {
          code: 'TRANSFER',
          permission: ['admin', 'customer']
        },
        loadChildren: () =>
          import('./modules/transfer/transfer.module').then((m) => m.TransferModule),
      },
      {
        path: 'category',
        canLoad: [AuthGuard],
        data: {
          code: 'CATEGORY',
          permission: ['admin', 'customer']
        },
        loadChildren: () =>
          import('./modules/category/category-ratio.module').then((m) => m.CategoryRatioModule),
      },
      {
        path: 'chat',
        canLoad: [AuthGuard],
        data: {
          code: 'CHAT',
          permission: ['admin']
        },
        loadChildren: () =>
          import('./modules/chat/chat.module').then((m) => m.ChatModule),
      },
      {
        path: 'config',
        canLoad: [AuthGuard],
        data: {
          code: 'CONFIG',
          permission: ['admin']
        },
        loadChildren: () =>
          import('./modules/config/config.module').then((m) => m.ConfigModule),
      },
      {
        path: 'contract',
        canLoad: [AuthGuard],
        data: {
          code: 'CONTRACT',
          permission: ['admin', 'customer']
        },
        loadChildren: () =>
          import('./modules/contract/contract.module').then((m) => m.ContractModule),
      },
      {
        path: 'contract-signing',
        canLoad: [AuthGuard],
        data: {
          code: 'CONTRACT',
          permission: ['customer']
        },
        loadChildren: () =>
          import('./modules/contract-registration/contract-registration.module').then((m) => m.ContractRegistrationModule),
      },
      {
        path: 'enterprise',
        canLoad: [AuthGuard],
        data: {
          code: 'ENTERPRISE',
          permission: ['customer']
        },
        loadChildren: () =>
          import('./modules/enterprise/enterprise.module').then((m) => m.EnterpriseModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule { }
