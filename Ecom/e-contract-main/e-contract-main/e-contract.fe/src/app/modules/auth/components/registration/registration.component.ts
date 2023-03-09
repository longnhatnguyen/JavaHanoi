import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { UserModel } from '../../models/user.model';
import { first } from 'rxjs/operators';
import { AuthService } from '../..';
import { CustomerService } from 'src/app/modules/layout/service/customer.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;
  OTP: any;
  verifiedOTP: boolean = false;
  showConfirmOTP: boolean = false;
  phone: string = ''
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private _customer: CustomerService,
    private _toastr: ToastrService
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registrationForm.controls;
  }

  initForm() {
    this.registrationForm = this.fb.group(
      {
        name: [
          '',
          Validators.compose([
            Validators.required,
          ])
        ],
        phone: [
          '',
          Validators.compose([
            Validators.pattern(/((^(\+84|84|0|0084){1})(3|5|7|8|9))+([0-9]{8})$/),
            Validators.required,
          ])
        ],
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(100),
          ]),
        ],
        cPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(100),
          ]),
        ],
        referral_code: [
          ''
        ],
        code: [
          ''
        ],
        // agree: [false, Validators.compose([Validators.required])],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );
  }

  submit() {
    this.hasError = false;
    const result: {
      [key: string]: string;
    } = {};
    Object.keys(this.f).forEach((key) => {
      result[key] = this.f[key].value;
    });
    // const newUser = new UserModel();
    // newUser.setUser(result);
    this.registrationForm.controls['phone'].enable()
    let create = this._customer.createCustomer(this.registrationForm.value).subscribe(res => {
      if (res.statusCode === 200) {
        this._toastr.success(res.message)
        this.authService.defaultLoginInfo ={
          username:this.registrationForm.value.phone,
          password:this.registrationForm.value.password
        }
        this.router.navigate(['/auth/login'])
      } else {
        this._toastr.error(res.message)
      }
    })
    this.unsubscribe.push(create)
    // const registrationSubscr = this.authService
    //   .registration(newUser)
    //   .pipe(first())
    //   .subscribe((user: UserModel) => {
    //     if (user) {
    //       this.router.navigate(['/']);
    //     } else {
    //       this.hasError = true;
    //     }
    //   });
    // this.unsubscribe.push(registrationSubscr);
  }
  sendOTP() {
    this.phone = this.registrationForm.value.phone;
    this._customer.sendOTPRegist(this.registrationForm.value.phone).subscribe(res => {
      if (res.statusCode === 200) {
        this._toastr.success(res.message);
        this.registrationForm.controls['phone'].disable();
        this.showConfirmOTP = true;
      }
    })
  }
  confirmOTP() {
    this._customer.checkOTP(this.phone, this.OTP).subscribe(res => {
      if (res.statusCode === 200) {
        this._toastr.success('Xác nhận OTP thành công!');
        this.showConfirmOTP = false;
        this.verifiedOTP = true;
      }else{
        this._toastr.error(res.message);
      }
    })
    // console.log(this.registrationForm.value.phone)
  }

  ngOnDestroy() {
    // this.authService.defaultLoginInfo ={
    //   username:this.registrationForm.value.phone,
    //   password:this.registrationForm.value.password
    // }
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
