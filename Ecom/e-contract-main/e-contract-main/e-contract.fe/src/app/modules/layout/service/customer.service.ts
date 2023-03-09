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
export class CustomerService {
  constructor(
    public http: HttpClient,
    private dataService: DataService,
    private config: Configuration,
  ) { }

  public getListCustomer(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}customer/list`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public getListAllCustomer() {
    return this.dataService.post(`${this.config.ApiUrl}customer/list`, {
      page_number: 0,
      page_size: 0,
      keyword: ""
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

  public getCustomerDetail(id: number) {
    return this.dataService.get(`${this.config.ApiUrl}customer/detail` + "?id=" + id).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public createCustomer(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}customer/create`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public ModifyCustomer(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}customer/modify`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public deleteCustomer(id: number) {
    return this.dataService.delete(`${this.config.ApiUrl}customer/delete` + "?customer_id=", id).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public sendOTPRegist(phone:string){
    return this.dataService.get(`${this.config.ApiUrl}customer/send-otp-regist` + "?phone_number="+phone).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }
  public sendOTPLogin(phone:string){
    return this.dataService.get(`${this.config.ApiUrl}customer/send-otp-login` + "?phone_number="+phone).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }
  public checkOTP(phone:string,OTP:string){
    return this.dataService.get(`${this.config.ApiUrl}customer/check-otp` + "?phone_number="+phone+"&otp="+OTP).pipe(
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
