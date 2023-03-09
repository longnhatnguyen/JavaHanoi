import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { mapArrayForDropDown, statusTransfer } from 'src/app/common/const';
import { AuthService } from 'src/app/modules/auth';
import { CategoryService } from 'src/app/modules/layout/service/category.service';
import { ConfirmDialogService } from 'src/app/modules/layout/service/confirm-dialog.service';
import { ContractService } from 'src/app/modules/layout/service/contract.service';
import { CustomerService } from 'src/app/modules/layout/service/customer.service';
import { TransferService } from 'src/app/modules/layout/service/transfer.service';
import { ApiStorageConstant } from 'src/app/modules/layout/shared/components/upload-file/fileupload-item';
import { Configuration } from 'src/app/modules/layout/shared/config/configuration';
import { ModalCreateEditTransferComponent } from '../../../../transfer/modal-create-edit-transfer/modal-create-edit-transfer.component';

@Component({
  selector: 'app-step5',
  templateUrl: './step5.component.html',
})
export class Step5Component implements OnInit {
  @Output('canNext') canNext = new EventEmitter<any>();
  @Input('contract') contract: any
  @Input('user') user: any
  transfers: any = [];
  info: any = {};
  stt: number = 0;
  totalRows: number = 0;

  status_id = mapArrayForDropDown(statusTransfer, 'name', 'id');
  formGroupCreate: FormGroup;
  transferList: any[];
  customerList: any[];
  customerSearchList: any[];
  contractList: any[];
  contractSearchList: any[];
  loading = true;
  customer_id;
  constructor(private transferService: TransferService,
    private customerService: CustomerService,
    private contractService: ContractService,
    private _category: CategoryService,
    private modalService: NgbModal,
    private confirmDialog: ConfirmDialogService,
    private config: Configuration,
    private fb: FormBuilder,
    private _auth: AuthService,
    private _toast: ToastrService) {
    if (JSON.parse(this._auth.currentUserValue).role == 'admin') {
      this.customer_id = 0
    } else {
      this.customer_id = JSON.parse(this._auth.currentUserValue).id;
    }
  }
  ngOnInit(): void {
    this.getTransferInformation();
    this.initFormGroupCreate()
    forkJoin([
      this.customerService.getListAllCustomer(),
      this.contractService.getListContract({
        page_number: 0,
        page_size: 0,
        keyword: "",
        customer_id: this.customer_id
      }),
      this.transferService.getListTransfer(this.formGroupCreate.value),
    ]).subscribe((res: any) => {
      this.customerList = res[0].data.lists;
      this.contractList = res[1].data.lists;
      this.customerSearchList = mapArrayForDropDown(res[0].data.lists, 'name', 'id')
      this.contractSearchList = mapArrayForDropDown(res[1].data.lists, 'customer_deputy', 'id')
      this.handleData(res[2])
      // this.loading
    })
  }
  getTransferInformation() {
    this._category.getConfigDetail().subscribe(res => {
      if (res.statusCode === 200) {
        this.info = res.data;
        if (res?.data?.image) {
          const img = res.data.image;
          this.info.QRCode = this.config.ApiUrl + ApiStorageConstant.fileImageUrl + img.path;
        }
      } else {
        this.info = {};
        this._toast.error(res.message + '! Lấy thông tin chuyển khoản không thành công!')
      }
    })
  }
  openCreateModifyTransferModal(item?: any, index?: any) {
    const dialogRef = this.modalService.open(ModalCreateEditTransferComponent,
      {
        size: 'lg',
      });
    dialogRef.componentInstance.itemDetail = item || {
      customer_id: this.user.id,
      contract_id: this.contract.id,
      transfer_content: `Chuyen tien theo hop dong so ${this.contract.contract_number}`,
      bank_account: this.contract.customer_account_number,
      bank_name: this.contract.customer_bank_name,
      transfer_amount: '',
      id: 0,
      is_delete: false,
    };
    dialogRef.componentInstance.contractList = null;
    dialogRef.componentInstance.customerList = null;
    dialogRef.componentInstance.formOption = item ? (item.status === 0 ? 'edit' : 'show') : 'add';
    dialogRef.componentInstance.itemSubmited.subscribe((res?: any) => {
      if (res) {
        this.getListTransfer();
      }
    });
  }
  reset() {
    this.formGroupCreate = this.fb.group({
      keyword: '',
      page_number: 1,
      page_size: 20,
      customer_id: this.user.id,
      contract_id: this.contract.id,
      status_id: null
    })
    this.getListTransfer()
  }

  getListTransfer(): void {
    this.transferService.getListTransfer(this.formGroupCreate.value).subscribe(rs => {
      this.handleData(rs)
    })
  }
  handleData(rs) {
    if (rs.data?.lists?.length !== 0) {
      this.canNext.emit(true);
      if (this.contract.status === 2) {
        this.contractService.changeStatus({
          contract_id: this.contract.id,
          status_id: 3
        }).subscribe(res => {
          if (res.statusCode === 200) {
            this.contract.status = 3;
            this._toast.success('Vui lòng chờ xác nhận!')
          }
        })
      }
    }
    this.totalRows = rs.data.totalcount;
    this.transferList = rs.data.lists;
    this.transferList.forEach(obj => {
      obj.customer_name = this.customerList.find(ele => ele.id == obj.customer_id).name;
      obj.customer_deputy = this.contractList.find(ele => ele.id == obj.contract_id).customer_deputy;
      obj.status_name = statusTransfer.find(ele => ele.id == obj.status).name;
    })
    this.stt = this.formGroupCreate.value.page_size * (rs.data.page - 1);
  }
  initFormGroupCreate() {
    this.formGroupCreate = this.fb.group({
      keyword: '',
      page_number: 1,
      page_size: 20,
      customer_id: this.customer_id,
      contract_id: this.contract.id,
      status_id: null
    })
  }
  onChangedPage(event: any): void {
    this.formGroupCreate.value.page_number = event.page;
    this.getListTransfer();
  }
}
