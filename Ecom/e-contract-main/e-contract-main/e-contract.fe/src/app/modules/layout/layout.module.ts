import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { RouterModule, Routes } from '@angular/router';
import {
  NgbDropdownModule,
  NgbProgressbarModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from './shared/i18n/index';
import { LayoutComponent } from './layout.component';
import { ExtrasModule } from './shared/partials/layout/extras/extras.module';
import { AsideComponent } from './shared/components/aside/aside.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { ContentComponent } from './shared/components/content/content.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ScriptsInitComponent } from './shared/components/scripts-init/scripts-init.component';
import { ToolbarComponent } from './shared/components/toolbar/toolbar.component';
import { AsideMenuComponent } from './shared/components/aside/aside-menu/aside-menu.component';
import { TopbarComponent } from './shared/components/topbar/topbar.component';
import { PageTitleComponent } from './shared/components/header/page-title/page-title.component';
import { HeaderMenuComponent } from './shared/components/header/header-menu/header-menu.component';
import {
  DrawersModule,
  DropdownMenusModule,
  ModalsModule,
  EngagesModule,
} from './shared/partials';
import { EngagesComponent } from './shared/partials/layout/engages/engages.component';
import { ThemeModeModule } from './shared/partials/layout/theme-mode-switcher/theme-mode.module';
import { LayoutRoutingModule } from './layout-routing.module';
import { UserInnerComponent } from './shared/partials/layout/extras/dropdown-inner/user-inner/user-inner.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { UploadFileModule } from './shared/components/upload-file/upload-file.module';
import { ZoomeImageModule } from './shared/components/zoom-image/zoom-image.module';
import { GalleriaModule } from 'primeng/galleria';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from './shared.module';

@NgModule({
  declarations: [
    LayoutComponent,
    AsideComponent,
    HeaderComponent,
    ContentComponent,
    FooterComponent,
    ScriptsInitComponent,
    ToolbarComponent,
    AsideMenuComponent,
    TopbarComponent,
    PageTitleComponent,
    HeaderMenuComponent,
    EngagesComponent,
    UserInnerComponent,
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    TranslationModule,
    InlineSVGModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    ExtrasModule,
    ModalsModule,
    DrawersModule,
    EngagesModule,
    DropdownMenusModule,
    NgbTooltipModule,
    UploadFileModule,
    ZoomeImageModule,
    GalleriaModule,
    SharedModule,
    TranslateModule.forRoot(),
    ToastrModule.forRoot(),
    ThemeModeModule
  ],
  exports: [RouterModule, UploadFileModule, GalleriaModule],
})
export class LayoutModule { }
