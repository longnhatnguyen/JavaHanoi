import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { mapArrayForDropDown } from 'src/app/common/const';
import { ConfirmDialogService } from 'src/app/modules/layout/service/confirm-dialog.service';
import { ContractService } from 'src/app/modules/layout/service/contract.service';
import { CustomerService } from 'src/app/modules/layout/service/customer.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-contract-management',
  templateUrl: './contract-management.component.html',
  styleUrls: ['./contract-management.component.scss']
})
export class ContractManagementComponent implements OnInit {

  stt: number = 0;
  totalRows: number = 0;

  searchForm: FormGroup;
  contractList: any[];
  statusList: string[] = ['Hợp đồng nháp', 'Đã chọn số tiền','Đã xác minh otp','Đã chuyển tiền - chờ kế toán xác nhận','Hoàn thành']
  colorList: string[] = ['text-danger', 'text-success','text-success','text-success','text-success']
  customer_id;
  customerList = [];
  constructor(
    private contractService: ContractService,
    private modalService: NgbModal,
    private confirmDialog: ConfirmDialogService,
    private _auth: AuthService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private customerService: CustomerService,
    public _router: Router,
    private cdr: ChangeDetectorRef
  ) {
    if (JSON.parse(this._auth.currentUserValue).role == 'admin') {
      this.customer_id = 0
    } else {
      this.customer_id = JSON.parse(this._auth.currentUserValue).id;
    }
  }

  ngOnInit(): void {
    this.initFormGroupCreate();
    this.getListContract();
    this.getListCustomer();
  }

  initFormGroupCreate() {
    this.searchForm = this.fb.group({
      keyword: '',
      page_number: 1,
      page_size: 20,
      customer_id: this.customer_id,
    })
  }

  getListCustomer() {
    this.customerService.getListAllCustomer().subscribe(res => {
      this.customerList = mapArrayForDropDown(res.data.lists, 'name', 'id');
      // this.customer_id && this.searchForm.patchValue({ customer_id: this.customer_id })
      this.cdr.detectChanges()
    })
  }

  search() {
    this.getListContract();
  }

  reset() {
    this.searchForm = this.fb.group({
      keyword: '',
      page_number: 1,
      page_size: 20,
      customer_id: this.customer_id,
    })
    this.getListContract()
  }

  getListContract(): void {
    this.contractService.getListContract({ ...this.searchForm.value }).subscribe(rs => {
      this.totalRows = rs.data.totalcount;
      this.contractList = rs.data.lists;
      this.stt = this.searchForm.value.page_size * (rs.data.page - 1);
    })
  }

  onChangedPage(event: any): void {
    this.searchForm.value.page_number = event.page;
    this.getListContract();
  }

  openReviewContractModal(contract) {
    this._router.navigate([`/contract/contract-transfer/${contract.id}`])
  }
  contractSigning(contract){
    this._router.navigate([`/contract-signing/${contract.id}`])

  }
}
