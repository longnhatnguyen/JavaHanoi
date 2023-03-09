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
export class CategoryService {
  constructor(
    public http: HttpClient,
    private dataService: DataService,
    private config: Configuration,
  ) { }

  // public getListCategoryRatio(data: any) {
  //   return this.dataService.post(`${this.config.ApiUrl}category/category-ratio-list`, data).pipe(
  //     map((res: any) => {
  //       return res;
  //     }),
  //     catchError((error: HttpErrorResponse) => {
  //       console.log(error);
  //       return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
  //     }),
  //   )
  // }

  public getListCategoryRatio(data: any) {
    return this.dataService.get(`${this.config.ApiUrl}category/category-ratio-list` + "?keyword=" + data.keyword + "&page_size=" + data.page_size + "&page_number=" + data.page_number).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public getListAllCategoryRatio() {
    return this.dataService.get(`${this.config.ApiUrl}category/category-ratio-list?keyword=&page_size=0&page_number=0`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public getCategoryRatioDetail(id: number) {
    return this.dataService.get(`${this.config.ApiUrl}category/category-ratio` + "?id=" + id).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public createCategoryRatio(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}category/category-ratio-create`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public modifyCategoryRatio(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}category/category-ratio-modify`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public deleteCategoryRatio(id: number) {
    return this.dataService.delete(`${this.config.ApiUrl}category/category-ratio-delete` + "?category_id=", id).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  // =====================================================================================================

  public getListCategoryStore(data: any) {
    return this.dataService.get(`${this.config.ApiUrl}category/category-store-list` + "?keyword=" + data.keyword + "&page_size=" + data.page_size + "&page_number=" + data.page_number + "&status=" + data.status + "&type=" + data.type).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  // public getListCategoryStore(data: any) {
  //   return this.dataService.get(`${this.config.ApiUrl}category/category-store-list` + "?keyword=" + data.keyword  + "&status=" + data.status + "&page_size=" + data.page_size + "&page_number=" + data.page_number).pipe(
  //     map((res: any) => {
  //       return res;
  //     }),
  //     catchError((error: HttpErrorResponse) => {
  //       console.log(error);
  //       return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
  //     }),
  //   )
  // }

  public getListAllCategoryStore() {
    return this.dataService.get(`${this.config.ApiUrl}category/category-store-list` + "?keyword=&page_size=" + 0 + "&page_number=" + 0 + "&status=" + "&type=").pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public getCategoryStoreDetail(id: number) {
    return this.dataService.get(`${this.config.ApiUrl}category/category-store` + "?id=" + id).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public createCategoryStore(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}category/category-store-create`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public modifyCategoryStore(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}category/category-store-modify`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public createInvesmentPackage(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}category/investment_package-create`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public modifyInvesmentPackage(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}category/investment_package-modify`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }
  public getInvesmentPackageList(data) {
    return this.dataService.get(`${this.config.ApiUrl}category/investment_package-list?keyword=${data.keyword}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }
  public getConfigDetail() {
    return this.dataService.get(`${this.config.ApiUrl}category/config-detail`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public deleteCategoryStore(id: number) {
    return this.dataService.delete(`${this.config.ApiUrl}category/category-store-delete` + "?category_id=", id).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public BusinessInfo() {
    let url = this.config.ApiUrl + 'business-info/'
    return {
      getList: (data: any) => {
        return this.dataService.post(`${url}list`, data).pipe(
          map((res: any) => {
            return res;
          }),
          catchError((error: HttpErrorResponse) => {
            console.log(error);
            return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
          }),
        )
      },
      get: (id: any) => {
        return this.dataService.get(`${url}detail?id=${id}`).pipe(
          map((res: any) => {
            return res;
          }),
          catchError((error: HttpErrorResponse) => {
            console.log(error);
            return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
          }),
        )
      },
      add: (data: any) => {
        return this.http.post(`${url}create`, data).pipe(
          map((res: any) => {
            return res;
          }),
          catchError((error: HttpErrorResponse) => {
            console.log(error);
            return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
          }),
        )
      },
      edit: (data: any) => {
        return this.http.post(`${url}modify`, data).pipe(
          map((res: any) => {
            return res;
          }),
          catchError((error: HttpErrorResponse) => {
            console.log(error);
            return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
          }),
        )
      },
      delete: (id: number) => {
        return this.http.get(`${url}delete?id=${id}`).pipe(
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
  }

}
