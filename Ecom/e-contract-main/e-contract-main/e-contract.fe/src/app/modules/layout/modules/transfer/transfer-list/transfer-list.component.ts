import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, forkJoin, Subscription } from 'rxjs';
import { ModalCreateEditTransferComponent } from '../modal-create-edit-transfer/modal-create-edit-transfer.component';
import { TransferService } from 'src/app/modules/layout/service/transfer.service';
import { CustomerService } from 'src/app/modules/layout/service/customer.service';
import { ContractService } from 'src/app/modules/layout/service/contract.service';
import { mapArrayForDropDown, statusTransfer } from 'src/app/common/const';
import { AuthService } from 'src/app/modules/auth';
import { ConfirmDialogService } from '../../../service/confirm-dialog.service';

@Component({
  selector: 'app-transfer-list',
  templateUrl: './transfer-list.component.html',
  styleUrls: ['./transfer-list.component.scss']
})
export class TransferListComponent implements OnInit {

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
  constructor(
    private transferService: TransferService,
    private customerService: CustomerService,
    private contractService: ContractService,
    private modalService: NgbModal,
    private confirmDialog: ConfirmDialogService,
    private fb: FormBuilder,
    private _auth: AuthService,
  ) {
    if (JSON.parse(this._auth.currentUserValue).role == 'admin') {
      this.customer_id = 0
    } else {
      this.customer_id = JSON.parse(this._auth.currentUserValue).id;
    }
  }

  ngOnInit(): void {
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
      this.contractSearchList = mapArrayForDropDown(res[1].data.lists, 'contract_number', 'id')
      this.handleData(res[2])
      // this.loading
    })
  }

  initFormGroupCreate() {
    this.formGroupCreate = this.fb.group({
      keyword: '',
      page_number: 1,
      page_size: 20,
      customer_id: this.customer_id,
      contract_id: null,
      status_id: null
    })
  }

  search() {
    this.getListTransfer();
  }

  reset() {
    this.formGroupCreate = this.fb.group({
      keyword: '',
      page_number: 1,
      page_size: 20,
      customer_id: this.customer_id,
      contract_id: null,
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
    this.totalRows = rs.data.totalcount;
    this.transferList = rs.data.lists;
    this.transferList.forEach(obj => {
      obj.customer_name = this.customerList.find(ele => ele.id == obj.customer_id).name;
      obj.contract_number = this.contractList.find(ele => ele.id == obj.contract_id).contract_number;
      obj.status_name = statusTransfer.find(ele => ele.id == obj.status).name;
    })
    this.stt = this.formGroupCreate.value.page_size * (rs.data.page - 1);
  }

  onChangedPage(event: any): void {
    this.formGroupCreate.value.page_number = event.page;
    this.getListTransfer();
  }

  changeStatusTransfer(transfer: any) {
    let status_id_complete = 2;
    this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn thay đổi trạng thái của phiên chuyển tiền này ?')
      .then((confirmed) => {
        if (confirmed) {
          this.transferService.changeStatus({ transfer_id: transfer.id, status_id: status_id_complete }).subscribe(rs => {
            this.getListTransfer();
          })
        }
      }
      )
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  openCreateModifyTransferModal(item?: any, index?: any) {
    const dialogRef = this.modalService.open(ModalCreateEditTransferComponent,
      {
        size: 'lg',
      });
    dialogRef.componentInstance.itemDetail = item || null;
    dialogRef.componentInstance.customerList = this.customerList || null;
    dialogRef.componentInstance.contractList = this.contractList || null;
    dialogRef.componentInstance.formOption = "show";
    dialogRef.componentInstance.itemSubmited.subscribe((res?: any) => {
      if (res) {
        this.getListTransfer();
      }
    });
  }

  deleteTransfer(transfer: any) {
    this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn xóa bản ghi này ?')
      .then((confirmed) => {
        if (confirmed) {
          this.transferService.deleteTransfer(transfer.id).subscribe(rs => {
            this.getListTransfer();
          })
        }
      }
      )
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
}
