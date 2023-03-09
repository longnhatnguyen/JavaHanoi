import { Component, ViewChild } from '@angular/core';
import { DashBoardService } from 'src/app/modules/layout/service/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  dashboardInfor;
  loading = true;
  constructor(
    private dashBoardService: DashBoardService,
  ) {
    this.getDashboardInfo()
  }

  getDashboardInfo() {
    this.dashBoardService
      .getDashBoardInfor()
      .subscribe((res: any) => {
        this.loading = false;
        this.dashboardInfor = res.data;
      });
  }
}
