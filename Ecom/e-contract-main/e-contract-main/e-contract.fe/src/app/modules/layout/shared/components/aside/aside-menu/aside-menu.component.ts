import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { ForgotPasswordComponent } from 'src/app/modules/auth/components/forgot-password/forgot-password.component';
import { environment } from 'src/environments/environment';
import { menu } from './data';

@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss'],
})
export class AsideMenuComponent implements OnInit {

  username;
  showSidebar = true;
  dropdown_menu = '';
  loading = true;
  constructor(
    public _auth: AuthService,
    private router: Router,
    private modalService: NgbModal,
    private changeDetector: ChangeDetectorRef,
  ) {
    this._auth.userInfo.subscribe(data => {
      if (data) {
        if (typeof data == 'string') {
          this.username = JSON.parse(data).full_name;
        } else {
          this.username = data.full_name;
        }
      }
    })

    window.addEventListener('storage', (event) => {
      if (event.storageArea != localStorage) return;
      if (event.key === 'full_name') {
        if (localStorage.getItem('full_name')) {
          this.username = localStorage.getItem('full_name');
          window.location.reload();
          this.router.navigate(['/main/dashboard']);
        } else {
          this.router.navigate(['/login']);
        }
      }
    });
  }
  $loading_sub: Observable<boolean>;
  menu: any[] = [];
  menuAuthen: any[] = [];

  ngOnInit(): void {
    this.$loading_sub = this._auth.getLoading();
    this.menu = menu;

    this._auth.currentToken.subscribe(token => {
      if (token) {
        try {
          if (localStorage.getItem('role') == 'admin') {
            // admin
            this.menu.forEach(obj => {
              if (localStorage.getItem('roles').includes(obj.code) && obj.role.includes('admin')) {
                this.menuAuthen.push(obj);
                this.loading = false;
              }
            })
          }
          // customer
          else {
            this.menu.forEach(obj => {
              if (obj.role.includes('customer')) {
                this.menuAuthen.push(obj);
                this.loading = false;
              }
            })
          }

        } catch {
          return;
        }
      } else {
        this.router.navigate(['/login'])
      }
    })
  }

  logOut() {
    this._auth.logout();
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  forgotPassword() {
    let item = JSON.parse(localStorage.getItem('userInfo'));
    const dialogRef = this.modalService.open(ForgotPasswordComponent,
      {
        size: 'lg',
      });
    dialogRef.componentInstance.itemDetail = item || null;
    dialogRef.componentInstance.itemSubmited.subscribe((res?: any) => { });
  }

}
