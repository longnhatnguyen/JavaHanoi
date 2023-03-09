import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractRegistrationRoutingModule } from './contract-registration-routing.module';
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
import { ContractSigningComponent } from './contract-signing/contract-signing.component';
import { Step1Component } from './contract-signing/steps/step1/step1.component';
import { Step2Component } from './contract-signing/steps/step2/step2.component';
import { Step3Component } from './contract-signing/steps/step3/step3.component';
import { Step4Component } from './contract-signing/steps/step4/step4.component';
import { Step5Component } from './contract-signing/steps/step5/step5.component';
import { Step6Component } from './contract-signing/steps/step6/step6.component';
@NgModule({
  declarations: [
    ContractSigningComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    Step5Component,
    Step6Component,
  ],
  imports: [
    CommonModule,
    ContractRegistrationRoutingModule,
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
export class ContractRegistrationModule { }
