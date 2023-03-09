import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TranslationService } from './../../../../../i18n';
import { AuthService, UserType } from 'src/app/modules/auth';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordComponent } from 'src/app/modules/layout/modules/user/user/forgot-password/forgot-password.component';
import { ModalCreateEditCustomerComponent } from 'src/app/modules/layout/modules/customer/customer/modal-create-edit-customer/modal-create-edit-customer.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-inner',
  templateUrl: './user-inner.component.html',
})
export class UserInnerComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  language: LanguageFlag;
  user$: Observable<UserType>;
  langs = languages;
  private unsubscribe: Subscription[] = [];

  role = localStorage.getItem('role');

  constructor(
    private auth: AuthService,
    private translationService: TranslationService,
    private modalService: NgbModal,
    private _auth: AuthService,
    public _router: Router,
  ) {}

  ngOnInit(): void {
    this.user$ = this.auth.currentUserSubject.asObservable();
    this.setLanguage(this.translationService.getSelectedLanguage());
  }

  logout() {
    this.auth.logout();
    document.location.reload();
  }

  selectLanguage(lang: string) {
    this.translationService.setLanguage(lang);
    this.setLanguage(lang);
    // document.location.reload();
  }

  setLanguage(lang: string) {
    this.langs.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
  }

  changePassword() {
    let item = JSON.parse(localStorage.getItem('userInfo'));
    const dialogRef = this.modalService.open(ForgotPasswordComponent,
      {
        size: 'lg',
      });
    dialogRef.componentInstance.itemDetail = item || null;
    dialogRef.componentInstance.itemSubmited.subscribe((res?: any) => { });
  }

  updateInfor(id) {
    this._router.navigate([`/customer/detail/${JSON.parse(this._auth.currentUserValue)?.id}`])
  }


  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

const languages = [
  {
    lang: 'en',
    name: 'English',
  },
  {
    lang: 'zh',
    name: 'Mandarin',
  },
  {
    lang: 'es',
    name: 'Spanish',
  },
  {
    lang: 'ja',
    name: 'Japanese',
  },
  {
    lang: 'de',
    name: 'German',
  },
  {
    lang: 'fr',
    name: 'French',
  },
];
