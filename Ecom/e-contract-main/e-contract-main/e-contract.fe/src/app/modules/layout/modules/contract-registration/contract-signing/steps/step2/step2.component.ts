import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoryService } from 'src/app/modules/layout/service/category.service';
import { ContractService } from 'src/app/modules/layout/service/contract.service';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
})
export class Step2Component implements OnInit {

  @Input('contract') contract
  @Output('canNext') canNext = new EventEmitter<any>();

  listInvestmentPackage: any = [
  ]
  selected: any;
  constructor(private _category: CategoryService, private _contract: ContractService
  ) {

  }
  ngOnInit(): void {
    this.getInvesmentPackageList()
  }
  getInvesmentPackageList() {
    this._category.getListAllCategoryRatio().subscribe(res => {
      this.listInvestmentPackage = res.data.lists;
      if (this.contract?.investment_id) {
        this.selected = this.listInvestmentPackage.find(ele =>
          ele.id === parseInt(this.contract.investment_id)
        )
        if (this.selected) {
          this.canNext.emit(true)
        }
      }
    })
  }
  selectItem(e) {
    this.contract.investment_id = e.data.id;
    this.contract.amount_of_investment = e.data.price;
    this.contract.number_of_shares = e.data.capital_value;
    this._contract.ModifyContract(this.contract).subscribe(res=>{
      res.statusCode===200 && this.canNext.emit(true);
      res.statusCode ===500 && this.canNext.emit(false);
    })
  }
}
