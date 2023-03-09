import { Component, OnInit } from '@angular/core';
import { AuthService } from '../..';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  constructor(private authService: AuthService) {
    this.authService.logout();
  }

  ngOnInit(): void {}
}