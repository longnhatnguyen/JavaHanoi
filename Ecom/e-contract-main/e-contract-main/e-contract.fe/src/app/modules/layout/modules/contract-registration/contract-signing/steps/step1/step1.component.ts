
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/modules/auth';
import { ContractService } from 'src/app/modules/layout/service/contract.service';
import { every, Observable, Subscription } from 'rxjs';
import { listBank } from 'src/app/common/const';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit, OnChanges {
  @Input('user') user: any = {};
  @Output('canNext') canNext = new EventEmitter<any>();
  @Input('contract') contract: any;
  errors: any = {};
  suggestUpdateInfo: boolean = false;
  listBank = listBank;
  //{
  //     id:0,
  // "customer_id": 0,
  // "contract_signature_date": "2022-08-06T04:06:30.664Z",
  // "customer_deputy": "string",
  // "customer_position": "string",
  // "customer_phone": "string",
  // "customer_email": "string",
  // "customer_adress": "string",
  // "customer_tax_code": "string",
  // "customer_account_number": "string",
  // "customer_bank_name": "string",
  // "customer_bank_account_id": 0,
  // "customer_id_number": "string",
  // "issuance_date": "2022-08-06T04:06:30.664Z",
  // "passport_issuer": "string",
  // "customer_date_of_birth": "2022-08-06T04:06:30.664Z",
  // "contract_number": 0,
  // "amount_of_investment": 0,
  // "amount_paid": 0,
  // "number_of_shares": 0,
  // "investment_id": 0,
  // "active_time": "2022-08-06T04:06:30.664Z",
  // "end_time": "2022-08-06T04:06:30.664Z",
  // "profit_percentage": 0,
  // "status": 0,
  // "validation_type": 0,
  // "note": "string",
  // "type": 1,
  // "id": 0,
  // "userAdded": 0,
  // "userUpdated": 0,
  // "dateAdded": "2022-08-06T04:06:30.664Z",
  // "dateUpdated": "2022-08-06T04:06:30.664Z",
  // "is_delete": true
  // }
  // ;

  constructor(private _auth: AuthService, private _contractService: ContractService, public _toast: ToastrService, private _router: Router) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.user && this.contract.id === 0) {
      this.contract.customer_id = this.user.id;
      this.contract.customer_phone = this.user.phone;
      this.contract.customer_address = this.user.address;
      this.contract.customer_tax_code = this.user.taxcode;
      this.contract.customer_date_of_birth = this.validVariable(this.user.birthday) ? new Date(this.user.birthday) : null;
      this.contract.customer_id_number = this.user.identity;
      this.errors = {};
      const validProp = ['id', 'phone', 'address', 'identity', 'birthday'];
      this.suggestUpdateInfo = !this.validVariableArray(this.user, validProp) && this.validVariable(this.user.banks) && this.user.banks?.length !== 0;
      console.log(this.user.banks);
      console.log(this.contract)
    }
  }
  validVariable(value: any) {
    if (value !== null && value !== undefined && value.toString().trim() !== "") {
      return true;
    }
    return false;
  }
  validVariableArray(object, array) {
    let arrayOfExist = array.map(ele => object[ele]);
    return arrayOfExist.every(ele => this.validVariable(ele));
  }
  ngOnInit(): void {
  }
  resetForm() {
    this.errors = {};
    console.log(this.errors);
  }
  valid() {
    this.errors = {};
    //'customer_email',
    let props = [['contract_number', 'customer_email', 'customer_id', 'customer_phone', 'customer_address', 'customer_date_of_birth', 'customer_id_number', 'issuance_date', 'passport_issuer', 'customer_bank_name', 'customer_account_number', 'customer_deputy', 'customer_bank_account_id'], ['contract_number', 'customer_id', 'customer_phone', 'customer_address', 'customer_tax_code', 'customer_date_of_birth', 'customer_id_number', 'issuance_date', 'customer_enterprise_code', 'customer_deputy', 'passport_issuer', 'customer_bank_name', 'customer_account_number', 'customer_enterprise_name', 'customer_email', 'customer_enterprise_short_name', 'customer_bank_account_id']];
    props[this.contract.type].forEach(ele => {
      !this.isValid(this.contract[ele]) && (this.errors[ele] = true);
    })
    console.log(this.errors);
    return Object.keys(this.errors).length === 0;
  }
  isValid(val) {
    return (val !== null && val !== undefined && val !== '');
  }
  createContract() {
    if (this.contract.type === 0) {
      this.contract.customer_deputy = this.user.name;
    }
    let props = [];
    for (let key in this.contract) {
      props.push(key);
    }
    if (this.valid()) {
      let sub: any = this.contract?.id === 0 ? this._contractService.createContract(this.contract) : this._contractService.ModifyContract(this.contract);
      sub.subscribe(res => {
        if (res.statusCode === 200) {
          this._toast.success(res.message);
          this.canNext.emit(true);
          this._router.navigate([`contract-signing/${res.data.id}`], { replaceUrl: true });
        } else {
          this._toast.error(res.message);
        }
      }, er => {
        this._toast.error('Có lỗi xảy ra trong quá trình xử lý! Vui lòng liên hệ nhà phát triển!')
      }
      )
    } else {
      this._toast.error(`Vui lòng nhập đầy đủ các thông tin bắt buộc!`)
    }
  }
  changeBankAccount(e) {
    console.log(e);
    let selectedBank = this.user?.banks.find(ele => ele.id === e.value)
    if (selectedBank) {
      this.contract.customer_bank_name = selectedBank.bank_name;
      this.contract.customer_account_number = selectedBank.bank_account;
    }
  }
  updateCustomerInfo() {
    this._router.navigate([`/customer/detail/${this.user.id}`]);
  }
}
