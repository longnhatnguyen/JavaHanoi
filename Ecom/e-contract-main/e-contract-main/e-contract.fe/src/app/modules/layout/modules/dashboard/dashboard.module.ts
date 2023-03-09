import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashBoardRoutingModule } from './dashboard-routing.module';
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
@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    DashBoardRoutingModule,
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
export class DashboardModule { }
