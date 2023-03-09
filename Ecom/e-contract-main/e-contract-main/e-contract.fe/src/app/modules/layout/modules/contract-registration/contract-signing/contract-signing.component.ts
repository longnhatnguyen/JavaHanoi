import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { ContractService } from 'src/app/modules/layout/service/contract.service';
import { CustomerService } from 'src/app/modules/layout/service/customer.service';
import { ApiStorageConstant } from 'src/app/modules/layout/shared/components/upload-file/fileupload-item';
import { Configuration } from 'src/app/modules/layout/shared/config/configuration';
import * as FileSaver from 'file-saver';
import { listBank } from 'src/app/common/const';
@Component({
  selector: 'app-contract-signing',
  templateUrl: './contract-signing.component.html',
  styleUrls: ['./contract-signing.component.scss']
})
export class ContractSigningComponent implements OnInit {
  formsCount = 6;
  account$: BehaviorSubject<any> =
    new BehaviorSubject<any>({});
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );
  user: any = {};
  canNext: boolean = false;
  contract: any = {};
  fileURL: any = '';
  maxstep: number = 0;
  private unsubscribe: Subscription[] = [];

  constructor(private _auth: AuthService, private config: Configuration, private _customer: CustomerService, private route: ActivatedRoute, private _contract: ContractService, private _toast: ToastrService) {
    let sub = this.route.params.subscribe(params => {
      console.log(params['id']);
      let id = parseInt(params['id']);
      if (id === 0) {
        this.maxstep = 1;
        this.currentStep$.next(1);
        this.canNext = false;
        this.contract = {
          id: 0,
          type: 0,
          contract_number: 'smg'
        }
      } else {
        this.canNext = true;
        this._contract.getContractDetail(id).subscribe(res => {
          console.log(res);
          res.data.customer_date_of_birth = new Date(res.data.customer_date_of_birth);
          res.data.issuance_date = new Date(res.data.issuance_date);
          this.contract = res.data;
          console.log(this.contract)
          let step = 1;
          step = this.mapStatusWithStep();
          this.maxstep = step;
          this.currentStep$.next(step);
          this.stepStrat(step);
        })
        this.genPDF(id);
      }
    })
    this.unsubscribe.push(sub);
  }
  mapStatusWithStep() {
    if (this.contract.status === 0) {
      return 2;
    }
    if (this.contract.status === 1) {
      return 4
    }
    if (this.contract.status === 2) {
      return 5
    }
    if (this.contract.status === 3) {
      return 6
    }
    if (this.contract.status === 4) {
      return 6
    }
  }

  ngOnInit(): void {
    this.getCustomerInFo()
  }

  nextStep() {
    const nextStep = this.currentStep$.value + 1;
    if (nextStep > this.formsCount) {
      return;
    }
    this.currentStep$.next(nextStep);
    this.stepStrat(nextStep);
    this.changeStatus(nextStep)
  }
  changeStatus(nextstep) {
    if (nextstep === 3 && this.contract.status === 0) {
      this._contract.changeStatus({
        contract_id: this.contract.id,
        status_id: 1
      }).subscribe(res => {
        if (res.statusCode === 200) {
          this.genPDF();
          this.contract.status = 1;
          this._toast.success('Chọn gói đầu tư thành công!')
          this.maxstep = this.mapStatusWithStep()
        }
      })
    }
    if (nextstep === 5 && this.contract.status === 1) {
      this._contract.changeStatus({
        contract_id: this.contract.id,
        status_id: 2
      }).subscribe(res => {
        if (res.statusCode === 200) {
          this.contract.status = 2;
          this.contract.contract_signature_date = new Date();
          this._contract.ModifyContract(this.contract).subscribe(res => {
            this._toast.success('Ký kết thành công!');
            this.maxstep = this.mapStatusWithStep()
          })
        }
      })
    }
  }
  stepStrat(step) {
    if (step === 2 && this.maxstep <= 2) {
      // this.genPDF();
      if (this.contract.investment_id === 0 || this.contract.investment_id === undefined || this.contract.investment_id === null) {
        this.canNext = false;
      }
      else {
        this.canNext = true
      }
    }
    if (step === 3 && this.maxstep <= 3) {
      this.fileURL = null;
    }
    if (step === 4 && this.maxstep <= 4) {
      this.canNext = false;
    }
  }

  prevStep() {
    const prevStep = this.currentStep$.value - 1;
    if (prevStep === 0) {
      return;
    }
    this.currentStep$.next(prevStep);
    this.stepStrat(prevStep);
    this.canNext = true;
  }
  getCustomerInFo() {
    this._customer.getCustomerDetail(JSON.parse(this._auth.currentUserValue).id).subscribe(res => {
      this.user = { ...res.data }
      if (this.user.banks !== null && this.user.banks !== undefined && this.user.banks?.length !== 0) {
        this.user.banks.forEach(userBank => {
          let foundBank = listBank.find(bank => userBank.bank_name === bank.name);
          userBank.bank_label = `${foundBank.name} - ${foundBank.code}`;
        })
      }
    })
  }
  changeCanNext(e) {
    this.canNext = e
  }
  genPDF(id?) {
    this._contract.genContractFile(id ? id : this.contract.id).subscribe(res => {
      console.log(res);
      this.fileURL = this.config.ApiUrl + ApiStorageConstant.filePDFUrl + res.data
    })
  }
  changeStep(step) {
    if (step <= this.maxstep) {
      this.currentStep$.next(step);
      this.stepStrat(step);
    }
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  savePdf() {
    this._contract.getContractFile(this.fileURL).subscribe(res => {
      console.log(res);
      var blob = new Blob([res], { type: 'application/pdf' });
      FileSaver.saveAs(blob, "Hợp_đồng_cổ_đông_smartgap.pdf");
    })

  }
}
