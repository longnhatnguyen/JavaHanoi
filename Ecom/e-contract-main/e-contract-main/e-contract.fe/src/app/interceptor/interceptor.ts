import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private _inProgressCount = 0;
  constructor(
    private authenService: AuthService,
    private spinner: NgxSpinnerService
  ) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    if (this._inProgressCount <= 0) {
      this.spinner.show();
    }
    this._inProgressCount++;
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authenService.currentTokenValue}`
      }
    });

    if (!request.headers.has('Content-Type')) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    }
    if (request.headers.get('Content-Type') == 'multipart/form-data') {
      request = request.clone({ headers: request.headers.delete('Content-Type') });
    }
    return next.handle(request).pipe(
      finalize(() => {
        this._inProgressCount--;
        if (this._inProgressCount === 0) {
          this.spinner.hide();
        }
      })
    );
  }
}
export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
];
