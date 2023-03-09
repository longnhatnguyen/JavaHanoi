import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmDialogService } from '../../../../service/confirm-dialog.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CustomerService } from '../../../../service/customer.service';
import { ModalCreateEditCustomerComponent } from '../modal-create-edit-customer/modal-create-edit-customer.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Configuration } from 'src/app/modules/layout/shared/config/configuration';
import { ApiStorageConstant } from 'src/app/modules/layout/shared/components/upload-file/fileupload-item';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {

  stt: number = 0;
  totalRows: number = 0;

  formGroupCreate: FormGroup;
  customerList: any[];
  url = this.config.ApiUrl + ApiStorageConstant.fileImageUrl;

  constructor(
    private customerService: CustomerService,
    private modalService: NgbModal,
    private confirmDialog: ConfirmDialogService,
    private fb: FormBuilder,
    private toast: ToastrService,
    public _router: Router,
    private config: Configuration,
  ) { }

  ngOnInit(): void {
    this.initFormGroupCreate();
    this.getListCustomer()
  }

  initFormGroupCreate() {
    this.formGroupCreate = this.fb.group({
      keyword: '',
      page_number: 1,
      page_size: 20,
    })
  }

  search() {
    this.getListCustomer();
  }

  reset() {
    this.formGroupCreate = this.fb.group({
      keyword: '',
      page_number: 1,
      page_size: 20,
    })
    this.getListCustomer()
  }

  getListCustomer(): void {
    this.customerService.getListCustomer(this.formGroupCreate.value).subscribe(rs => {
      this.totalRows = rs.data.totalcount;
      this.customerList = rs.data.lists;
      this.stt = this.formGroupCreate.value.page_size * (rs.data.page - 1);
    })
  }

  onChangedPage(event: any): void {
    this.formGroupCreate.value.page_number = event.page;
    this.getListCustomer();
  }

  openCreateModifyCustomerModal(item?: any, index?: any) {
    this._router.navigate([`/customer/detail/${item.id}`])
  }

  deleteCustomer(customer: any) {
    this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn xóa bản ghi này ?')
      .then((confirmed) => {
        if (confirmed) {
          this.customerService.deleteCustomer(customer.id).subscribe(rs => {
            if (rs.statusCode == 200) {
              this.toast.success("Xóa khách hàng thành công !");
              this.getListCustomer();
            } else {
              this.toast.warning(rs.message);
            }
          })
        }
      }
      )
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  showZoomImage = false;
  showImage(index) {
    this.showZoomImage = index + 1;
    console.log(this.showZoomImage)
  }

  handleData(data) {
    this.showZoomImage = data;
  }
}
