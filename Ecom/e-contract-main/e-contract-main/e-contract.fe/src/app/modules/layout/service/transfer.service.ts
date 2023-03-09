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
export class TransferService {
  constructor(
    public http: HttpClient,
    private dataService: DataService,
    private config: Configuration,
  ) { }

  public getListTransfer(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}transfer/list`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public getListAllTransfer() {
    return this.dataService.post(`${this.config.ApiUrl}transfer/list`, {
      page_number: 0,
      page_size: 0,
      keyword: "",
      customer_id: 0,
      contract_id: 0,
      status_id: 0
    }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public getTransferDetail(id: number) {
    return this.dataService.get(`${this.config.ApiUrl}transfer/detail` + "?transfer_id=" + id).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public createTransfer(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}transfer/create`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public ModifyTransfer(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}transfer/modify`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public changeStatus(data: any) {
    return this.dataService.get(`${this.config.ApiUrl}transfer/change-status` + "?transfer_id=" + data.transfer_id + "&status_id=" + data.status_id).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public deleteTransfer(id: number) {
    return this.dataService.delete(`${this.config.ApiUrl}transfer/delete` + "?transfer_id=", id).pipe(
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
