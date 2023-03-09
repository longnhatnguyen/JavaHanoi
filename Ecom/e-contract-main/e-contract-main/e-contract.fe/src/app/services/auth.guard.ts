import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, CanLoad, UrlTree, Route, UrlSegment } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private router: Router,
    private authenticationService: AuthService,
    private toastr: ToastrService
  ) { }
  // localStorage.setItem('userInfo',JSON.stringify(data))

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkAuth(route.data['code'], route.data['permission'])
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.checkAuth(childRoute.data['code'], childRoute.data['permission'])
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.checkAuth(route.data['code'], route.data['permission'])
  }

  checkAuth(code, permission) {
    // debugger
    let token = localStorage.getItem('currentToken');
    if (!token) {
      this.toastr.error('Vui lòng đăng nhập!')
      this.router.navigate(['/auth/login'])
      return of(false)
    } else {
      if (localStorage.getItem('role') == 'admin') {
        if (permission.includes('admin')) {
          let authentication = localStorage.getItem('roles');
          if (authentication.includes(code)) {
            return of(true);
          } else {
            if (code.includes('ADMIN')) {
              this.router.navigate(['/contract/contract-management']);
            } else {
              this.router.navigate(['/dashboard']);
            }
            return of(false);
          }
        }
        else {
          this.toastr.warning("Bạn không có quyền truy cập vào phần này!!! :((");
          this.router.navigate(['/contract/contract-management']);
          return of(false)
        }
      }
      else {
        if (permission.includes('customer')) {
          return of(true)
        }
        else {
          this.toastr.warning("Bạn không có quyền truy cập vào phần này!!! :((");
          this.router.navigate(['/dashboard']);
          return of(false)
        }
      }
    }
  }
}
