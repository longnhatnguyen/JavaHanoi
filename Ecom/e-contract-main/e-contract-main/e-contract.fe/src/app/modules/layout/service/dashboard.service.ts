import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { Configuration } from '../shared/config/configuration';

@Injectable({
  providedIn: 'root'
})
export class DashBoardService {
  constructor(
    public http: HttpClient,
    private dataService: DataService,
    private config: Configuration,
  ) { }

  public getBusinessInfor(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}dashboard/business-info`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public getAdminStockInfor(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}dashboard/admin-stock-info`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public getDashBoardInfor() {
    return this.dataService.post(`${this.config.ApiUrl}dashboard/admin-dashboard-info`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

}
