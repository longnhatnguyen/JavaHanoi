import { ContractService } from 'src/app/modules/layout/service/contract.service';
import { CategoryService } from 'src/app/modules/layout/service/category.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
})
export class Step3Component implements OnInit {
  @Input('fileURL')fileURL;
  constructor(){

  }
  ngOnInit(): void {
  }
}
