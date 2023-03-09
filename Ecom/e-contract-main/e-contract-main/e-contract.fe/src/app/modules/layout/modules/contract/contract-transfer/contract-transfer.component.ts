import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { mapArrayForDropDown, statusTransfer } from 'src/app/common/const';
import { ConfirmDialogService } from 'src/app/modules/layout/service/confirm-dialog.service';
import { ContractService } from 'src/app/modules/layout/service/contract.service';
import { CustomerService } from 'src/app/modules/layout/service/customer.service';
import { TransferService } from 'src/app/modules/layout/service/transfer.service';
import { ApiStorageConstant } from 'src/app/modules/layout/shared/components/upload-file/fileupload-item';
import { Configuration } from 'src/app/modules/layout/shared/config/configuration';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-contract-transfer',
  templateUrl: './contract-transfer.component.html',
  styleUrls: ['./contract-transfer.component.scss']
})
export class ContractTransferComponent implements OnInit {

  stt: number = 0;
  totalRows: number = 0;
  page_number = 1;
  page_size = 20;
  contract_id;
  contractDetail;
  transferList;
  loading = true;
  url = this.config.ApiUrl + ApiStorageConstant.fileImageUrl;
  showZoomImage = false;
  formGroupCreate!: FormGroup;

  constructor(
    private contractService: ContractService,
    private modalService: NgbModal,
    private confirmDialog: ConfirmDialogService,
    private _auth: AuthService,
    private fb: FormBuilder,
    private config: Configuration,
    private toast: ToastrService,
    private transferService: TransferService,
    private activatedRoute: ActivatedRoute,
    public _router: Router,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.contract_id = params.id;
      this.getContractDetail(this.contract_id);
      this.getListTransfer(this.contract_id)
    })
  }

  getContractDetail(id) {
    this.contractService.getContractDetail(id).subscribe(res => {
      this.contractDetail = res.data;
      this.loading = false;
    })
  }

  getListTransfer(id) {
    this.transferService.getListTransfer({
      page_number: this.page_number,
      page_size: this.page_size,
      keyword: "",
      customer_id: 0,
      contract_id: id,
      status_id: 0
    }).subscribe(res => {
      this.transferList = res.data.lists;
      this.totalRows = res.data.totalcount;
      this.stt = this.page_size * (res.data.page - 1);
      this.transferList.forEach(obj => {
        obj.status_name = statusTransfer.find(ele => ele.id == obj.status).name;
      })
    })
  }

  onChangedPage(event: any): void {
    this.page_number = event.page;
    this.getListTransfer(this.contract_id);
  }

  showImage(index) {
    this.showZoomImage = index + 1;
    console.log(this.showZoomImage)
  }

  handleData(data) {
    this.showZoomImage = data;
  }

}
