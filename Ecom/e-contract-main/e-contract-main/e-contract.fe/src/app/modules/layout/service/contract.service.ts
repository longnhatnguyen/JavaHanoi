import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { Configuration } from '../shared/config/configuration';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  constructor(
    public http: HttpClient,
    private dataService: DataService,
    private config: Configuration,
  ) { }

  public getListContract(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}contract/list`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public getListAllContract() {
    return this.dataService.post(`${this.config.ApiUrl}contract/list`, {
      page_number: 0,
      page_size: 0,
      keyword: "",
      customer_id: 0
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

  public getContractDetail(id: number) {
    return this.dataService.get(`${this.config.ApiUrl}contract/detail` + "?contract_id=" + id).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }
  public genContractFile(id: number) {
    return this.dataService.get(`${this.config.ApiUrl}contract/gen-pdf` + "?contract_id=" + id).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }
  public getContractFile(url: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.http.get(url, { headers: headers, responseType: 'blob' });
  }

  public createContract(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}contract/create`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public ModifyContract(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}contract/modify`, data).pipe(
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
    return this.dataService.get(`${this.config.ApiUrl}contract/change-status` + "?contract_id=" + data.contract_id + "&status_id=" + data.status_id).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public deleteContract(id: number) {
    return this.dataService.delete(`${this.config.ApiUrl}contract/delete` + "?contract_id=", id).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }
  public sendOTPConfirm(phone:string,contract_number:string){
    return this.dataService.get(`${this.config.ApiUrl}contract/send-otp-confirm` + "?phone_number="+phone+"&contract_code="+contract_number).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }
  public checkOTP(phone:string,OTP:string,contract_number:string){
    return this.dataService.get(`${this.config.ApiUrl}contract/check-otp` + "?phone_number="+phone+"&otp="+OTP+"&contract_code="+contract_number).pipe(
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
