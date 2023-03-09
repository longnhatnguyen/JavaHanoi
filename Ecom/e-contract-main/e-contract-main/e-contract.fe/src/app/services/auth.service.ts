import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription, Subject } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../modules/auth';
import { AuthModel } from '../modules/auth/models/auth.model';
import { Configuration } from '../modules/layout/shared/config/configuration';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentTokenSub: BehaviorSubject<any>;
  public currentToken: Observable<any>;
  public currentUserSubject: BehaviorSubject<any>;
  public defaultLoginInfo:any={
    username:'',
    password:''
  };
  public userInfo: Observable<any>;
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  constructor(
    private http: HttpClient,
    private router: Router,
    private config: Configuration,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
    this.currentTokenSub = new BehaviorSubject<any>(localStorage.getItem('currentToken'));
    this.currentToken = this.currentTokenSub.asObservable();
    this.currentUserSubject = new BehaviorSubject<any>(localStorage.getItem('userInfo'));
    this.userInfo = this.currentUserSubject.asObservable();
  }

  public get currentTokenValue(): any {
    return localStorage.getItem('currentToken')
  }
  public get currentUserValue(): any {
    return localStorage.getItem('userInfo');
    // return JSON.stringify(this.currentUserSubject.getValue());
  }

  public get currentUserName(): any {
    return localStorage.getItem('full_name');
  }

  setCurrentUserSubjectValue(id: any, full_name: any, image?: any): void {

    let oldUser = JSON.parse(this.currentUserValue);
    let newUser = {
      ...oldUser,
      full_name: full_name,
      image: image,
    }

    if (oldUser.id == id) {
      this.currentUserSubject.next(JSON.stringify(newUser));

      localStorage.removeItem('userInfo');
      localStorage.removeItem('full_name')

      localStorage.setItem('userInfo', JSON.stringify(newUser));
      localStorage.setItem('full_name', full_name);
    }
  }

  showLoading() {
    this.isLoadingSubject.next(true);
  }
  hideLoading() {
    this.isLoadingSubject.next(false);
  }
  getLoading() {
    return this.isLoadingSubject.asObservable();
  }
  checkToken() {
    return this.validVariable(this.currentTokenSub.value);
  }

  validVariable(value: any) {
    if (value !== null && value !== undefined && value.toString().trim() !== "") {
      return true;
    }
    return false;
  }

  login(dataAuthen: { username: string; password: string; RememberMe: boolean; }, admin?): Observable<any> {
    const loginURL = `${this.config.ApiUrl}${admin ? 'admin/admin-login' : 'customer/login'}`;
    let role = admin ? 'admin' : 'customer';
    return this.http.post(loginURL, { username: dataAuthen.username, password: dataAuthen.password }).pipe(
      map((res: any) => {
        if (res.data) {
          let data = res.data;
          if (this.validVariable(data.token)) {
            this.setUserData(data, role);
            return res
          } else {
            return res;
          }
        } else {
          return res;
        }
      })
    )
  }
  loginOTP(username,OTP){
    const loginURL = `${this.config.ApiUrl}customer/login-otp?phone_number=${username}&otp=${OTP}`;
    return this.http.get(loginURL).pipe(
      map((res: any) => {
        if (res.data) {
          let data = res.data;
          if (this.validVariable(data.token)) {
            this.setUserData(data, 'customer');
            return res
          } else {
            return res;
          }
        } else {
          return res;
        }
      })
    )
  }
  setUserData(data, role){
    if (data.RememberMe) {
      localStorage.setItem('loginData', data);
    }
    this.currentTokenSub.next(data.token);
    this.currentUserSubject.next({...data, role: role});

    console.log(this.currentUserSubject)
    localStorage.setItem('userInfo', JSON.stringify({...data, role: role}));
    localStorage.setItem('full_name', data.full_name)
    localStorage.setItem('roles', data.roles)
    localStorage.setItem('role', role)
    localStorage.setItem('username', data.username)
    localStorage.setItem('currentToken', data.token);
  }
  public logout() {
    (window as any).autoLogin = false;
    localStorage.removeItem('currentToken');
    localStorage.removeItem('full_name');
    localStorage.removeItem('roles')
    localStorage.removeItem('role')
    localStorage.removeItem('username')
    localStorage.removeItem('userInfo')
    this.currentTokenSub.next(null);
    this.currentUserSubject.next(null)
    this.router.navigate(['/login']);
    return true;
  }

}
