import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import {
  HttpRequest,
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { DataService } from './data.service';
import { ApiStorageConstant } from '../shared/components/upload-file/fileupload-item';
import { Configuration } from '../shared/config/configuration';

@Injectable({
  providedIn: 'root',
})
export class UploadFileService {
  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private config: Configuration
  ) {}
  urlApiImg: string = this.config.ApiUrl + ApiStorageConstant.UploadImg;
  urlApiDoc: string =
    this.config.ApiUrl + ApiStorageConstant.UploadFileDocument;
  uploadImage(formData: FormData): Observable<any> {
    // console.log("==========================================")
    return this.http
      .post(this.urlApiImg, formData, {
        headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' }),
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((error: HttpErrorResponse) => {
          console.log(error);
          return throwError(
            `Error Code: ${error.status}\nMessage: ${error.message}`
          );
        })
      );
  }

  uploadFileDocument(formData: any): Observable<any> {
    const reqQuery = new HttpRequest('POST', this.urlApiDoc, formData, {
      reportProgress: true,
      headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' }),
    });
    return this.http.request(reqQuery);
  }
}
