import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AuthService } from '../modules/auth';

@Directive({
  selector: '[appHasRole]',
})
export class HasRoleDirective {
  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private auth: AuthService
  ) {}

  @Input() set appHasRole(permission: any) {
    var isAuthorize = false;
    var listPermission = JSON.parse(this.auth.currentUserValue).roles;
    if (listPermission != null && listPermission.length > 0) {
      permission.forEach(function (item) {
        if (item == '') {
          isAuthorize = true;
        }
        if (!isAuthorize && listPermission.indexOf(item) != -1) {
          isAuthorize = true;
        }
      });
    }
    if (isAuthorize) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }

  ngOnInit() {}
}
