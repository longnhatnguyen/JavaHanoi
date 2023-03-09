import { ToastrService } from 'ngx-toastr';
import { ContractService } from 'src/app/modules/layout/service/contract.service';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
})
export class Step4Component implements OnInit {
  OTP: any;
  phone: any;
  disableSend:boolean=false;
  disableConfirm:boolean=true;
  @Output('canNext') canNext = new EventEmitter<any>();
  @Input('contract') contract: any
  constructor(private _contract: ContractService,private _toast:ToastrService) {

  }
  ngOnInit(): void {

  }
  sendOTP() {
    this._contract.sendOTPConfirm(this.contract.customer_phone,this.contract.contract_number).subscribe(res => {
      if(res.statusCode===200){
        this._toast.success(res.message);
        this.disableSend = true;
        this.disableConfirm = false;
      }
    })
  }
  confirmOTP() {
    this._contract.checkOTP(this.contract.customer_phone,this.OTP,this.contract.contract_number).subscribe(res=>{
      if(res.statusCode ===200){
        this._toast.success('Ký OTP thành công vui lòng tiếp tục!');
        this.contract.validation_type = 0;
        this._contract.ModifyContract(this.contract).subscribe(res=>{});
        this.disableConfirm = true;
        this.canNext.emit(true);
      }else{
        this._toast.error('Mã xác thực không đúng vui lòng thử lại')
      }
    })
  }
}
