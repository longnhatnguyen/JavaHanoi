import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserModel } from '../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../..';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/app/modules/layout/service/customer.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  // KeenThemes mock, change it to:
  defaultAuth: any = {
    username: '',
    password: '',
  };
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;
  validOTP: boolean = false;
  isOTPLogin: boolean = false;
  showConfirmOTP: any = false;
  OTP: any;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private _customer: CustomerService,
    public _toastr: ToastrService
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    // if (this.authService.currentUserValue) {
    //   this.router.navigate(['/']);
    // }
  }

  ngOnInit(): void {
    console.log(this.authService.defaultLoginInfo);
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      username: [
        this.authService.defaultLoginInfo.username!==''?this.authService.defaultLoginInfo.username: this.defaultAuth.username,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      password: [
        this.authService.defaultLoginInfo.password!==''?this.authService.defaultLoginInfo.password: this.defaultAuth.password,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ]),
      ],
      RememberMe: false,
    });
  }

  admin = false;
  submit() {
    if (!this.isOTPLogin) {
      this.hasError = false;
      const loginSubscr = this.authService.login(this.loginForm.value, this.admin).subscribe((res: any) => {
        if (res.statusCode === 200) {
          this._toastr.success('Đăng nhập thành công!')
          this.router.navigate(['/dashboard'])
        } else {
          this._toastr.error(res.message)
        }
      })
      this.unsubscribe.push(loginSubscr);
    } else {
      this.authService.loginOTP(this.loginForm.value.username, this.OTP).subscribe(res=>{
        if (res.statusCode === 200) {
          this._toastr.success('Đăng nhập thành công!')
          this.router.navigate(['/dashboard'])
        } else {
          this._toastr.error(res.message)
        }
      });
    }
  }
  sendOTP() {
    this._customer.sendOTPLogin(this.loginForm.value.username).subscribe(res => {
      if (res.statusCode === 200) {
        this._toastr.success(res.message);
        this.showConfirmOTP = true;
      }else {
        this._toastr.warning(res.message);
      }
    })
  }
  confirmOTP() {
    this._customer.checkOTP(this.loginForm.value.username, this.OTP).subscribe(res => {
      if (res.statusCode === 200) {
        this._toastr.success('Xác nhận OTP thành công!');
        this.showConfirmOTP = false;
        this.validOTP = true;
      } else {
        this._toastr.error(res.message);
      }
    })
    // console.log(this.registrationForm.value.phone)
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
