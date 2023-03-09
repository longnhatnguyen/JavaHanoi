import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Configuration } from '../shared/config/configuration';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  langPram: string = "vi";
  constructor(
    private router: Router,
    private dataService: DataService,
    private config: Configuration,
  ) {
    this.langPram = "?language_code=" + "vi";
  }

  // Get All provinces
  public GetProvices(): Observable<any> {
    return this.dataService.get(`${this.config.ApiUrl}category/category-province-list${this.langPram}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return of(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  // Get All District
  public GetDistricts(): Observable<any> {
    return this.dataService.get(`${this.config.ApiUrl}category/category-district-list${this.langPram}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return of(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  // Get Districts by Province
  public GetDistrictsByProvince(province_id: any): Observable<any> {
    return this.dataService.get(`${this.config.ApiUrl}category/category-district-list-province${this.langPram}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return of(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  // Get All Wards
  public GetWatds(): Observable<any> {
    return this.dataService.get(`${this.config.ApiUrl}category/category-ward-list${this.langPram}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return of(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  // Get Wards by District
  public GetWatdsByDistrict(district_id: any): Observable<any> {
    return this.dataService.get(`${this.config.ApiUrl}category/category-ward-list-district${this.langPram}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return of(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  // Get All national
  public GetNationals(): Observable<any> {
    return this.dataService.get(`${this.config.ApiUrl}category/category-nation-list${this.langPram}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return of(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  // Goong MAP API
  public SearchLocationByAddres(address: string): Observable<any> {
    return this.dataService.get(`https://rsapi.goong.io/Place/AutoComplete?api_key=${environment.goongMapApiKey}&input=` + address).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public GetLngLatByPlaceId(place_id: string): Observable<any> {
    return this.dataService.get(`https://rsapi.goong.io/Place/Detail?api_key=${environment.goongMapApiKey}&place_id=` + place_id).pipe(
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
