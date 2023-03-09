import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth';
import { Configuration } from '../../config/configuration';
import { LayoutService } from '../../core/layout.service';
import { ApiStorageConstant } from '../upload-file/fileupload-item';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  toolbarButtonMarginClass = 'ms-1 ms-lg-3';
  toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px';
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px';
  toolbarButtonIconSizeClass = 'svg-icon-1';
  headerLeft: string = 'menu';
  url = this.config.ApiUrl + ApiStorageConstant.fileImageUrl;
  username;
  avatar;
  customer_id;
  constructor(
    private layout: LayoutService,
    public _auth: AuthService,
    private router: Router,
    private config: Configuration,
  ) {

    if (JSON.parse(this._auth.currentUserValue)?.roles) {
      this.customer_id = 0
    } else {
      this.customer_id = JSON.parse(this._auth.currentUserValue)?.id;
    }

    window.addEventListener('storage', (event) => {
      if (event.storageArea != localStorage) return;
      if (event.key === 'userInfo' || event.key === 'full_name') {
        // window.location.reload();
        if (localStorage.getItem('full_name')) {
          this.username = localStorage.getItem('full_name');
          // window.location.reload();
          this.router.navigate(['/main/dashboard']);
        } else {
          this.router.navigate(['/login']);
        }
        this.getUserInfor()
      }
    });

    this.getUserInfor()
  }

  getUserInfor() {
    this._auth.userInfo.subscribe(data => {
      if (data) {
        if (typeof data == 'string') {
          this.avatar = JSON.parse(data).image?.path;
          this.username = JSON.parse(data).full_name;
        } else {
          this.avatar = data.image?.path;
          this.username = data.full_name;
        }
      }
    })

  }

  ngOnInit(): void {
    this.headerLeft = this.layout.getProp('header.left') as string;
  }
}
