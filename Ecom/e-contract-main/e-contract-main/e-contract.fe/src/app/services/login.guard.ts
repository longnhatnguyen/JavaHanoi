import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate, CanLoad {
  constructor(
    private router: Router,
    private toastr: ToastrService
  ) { }
  // localStorage.setItem('userInfo',JSON.stringify(data))

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    let token = localStorage.getItem('currentToken');
    if (!token) {
      return of(true)
    } else {
      this.router.navigate(['/main/dashboard'])
      return of(false)
    }
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    let token = localStorage.getItem('currentToken');
    // debugger
    if (!token) {
      return of(true)
    } else {
      // console.log('có token')
      this.router.navigate(['/main/dashboard'])
      return of(false)
    }
  }
}
