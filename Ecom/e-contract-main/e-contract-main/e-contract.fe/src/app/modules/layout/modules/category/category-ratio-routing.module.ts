import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessInfoListComponent } from './business-info/business-info-list/business-info-list.component';
import { CategoryRatioListComponent } from './category-ratio/category-ratio-list/category-ratio-list.component';
import { CategoryStoreListComponent } from './category-store/category-store-list/category-store-list.component';
import { ViewDetailCategoryStoreComponent } from './category-store/view-detail-category-store/view-detail-category-store.component';
const routes: Routes = [
  {
    path: '',
    children:
      [
        // {
        //   path: '',
        //   redirectTo: '/category/category-ratio',
        //   pathMatch: 'full',
        // },
        {
          path: 'category-ratio',
          component: CategoryRatioListComponent,
        },
        {
          path: 'category-store',
          component: CategoryStoreListComponent,
        },
        {
          path: 'view-detail-category-store/:id',
          component: ViewDetailCategoryStoreComponent,
        },{
          path: 'business-info',
          component: BusinessInfoListComponent,
        },
      ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRatioRoutingModule { }
