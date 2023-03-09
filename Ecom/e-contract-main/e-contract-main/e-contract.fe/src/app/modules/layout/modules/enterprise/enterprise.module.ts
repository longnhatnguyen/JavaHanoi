import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnterpriseRoutingModule } from './enterprise-routing.module';
import { WidgetsModule } from '../../shared/partials';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { InputTextModule } from 'primeng/inputtext';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ZoomeImageModule } from '../../shared/components/zoom-image/zoom-image.module';
import { EnterpriseIntroComponent } from './enterprise-intro/enterprise-intro.component';
import { EnterpriseOrganizationalStructureComponent } from './enterprise-organizational-structure/enterprise-organizational-structure.component';

@NgModule({
  declarations: [
    EnterpriseIntroComponent,
    EnterpriseOrganizationalStructureComponent
  ],
  imports: [
    CommonModule,
    EnterpriseRoutingModule,
    WidgetsModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    CalendarModule,
    DropdownModule,
    TableModule,
    InputTextModule,
    NgxDocViewerModule,
    PdfViewerModule,
    PaginationModule.forRoot(),
    OverlayPanelModule,
    ZoomeImageModule
  ],
})
export class EnterpriseModule { }