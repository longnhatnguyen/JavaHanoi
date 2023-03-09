import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/modules/layout/service/category.service';
import { ConfirmDialogService } from 'src/app/modules/layout/service/confirm-dialog.service';
import { BusinessInfoModalComponent } from '../business-info-modal/business-info-modal.component';

@Component({
  selector: 'app-business-info-list',
  templateUrl: './business-info-list.component.html',
  styleUrls: ['./business-info-list.component.scss']
})
export class BusinessInfoListComponent implements OnInit {


  stt: number = 0;
  totalRows: number = 0;
  filter:any = {};
  formGroupCreate: FormGroup;
  categoryList: any[];
  constructor(
    private categoryService: CategoryService,
    private modalService: NgbModal,
    private confirmDialog: ConfirmDialogService,
    private fb: FormBuilder,
    private toast: ToastrService,
    public _router: Router,
  ) { }

  ngOnInit(): void {
    this.initFormGroupCreate();
    this.getListCategory()
  }

  initFormGroupCreate() {
    this.formGroupCreate = this.fb.group({
      start_date:null,
      end_date:null,
      page_number: 1,
      page_size: 20,
    })
  }

  search() {
    this.getListCategory();
  }

  reset() {
    this.formGroupCreate = this.fb.group({
      start_date:null,
      end_date:null,
      page_number: 1,
      page_size: 20,
    })
    this.getListCategory()
  }

  getListCategory(): void {
    let data = {...this.formGroupCreate.value}
    this.categoryService.BusinessInfo().getList(data).subscribe(rs => {
      this.totalRows = rs.data.totalcount;
      this.categoryList = rs.data.lists;
      this.stt = this.formGroupCreate.value.page_size * (rs.data.page - 1);
    })
  }

  onChangedPage(event: any): void {
    this.formGroupCreate.value.page_number = event.page;
    this.getListCategory();
  }

  openCreateModifyCategoryModal(item?: any, index?: any) {
    const dialogRef = this.modalService.open(BusinessInfoModalComponent,
      {
        size: 'lg',
      });
    dialogRef.componentInstance.itemDetail = item || null;
    dialogRef.componentInstance.itemSubmited.subscribe((res?: any) => {
      if (res) {
        this.getListCategory();
      }
    });
  }

  deleteCategory(category: any) {
    this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn xóa bản ghi này ?')
      .then((confirmed) => {
        if (confirmed) {
          this.categoryService.BusinessInfo().delete(category.id).subscribe(rs => {
            if (rs.statusCode == 200) {
              this.toast.success("Xóa thành công !");
              this.getListCategory();
            } else {
              this.toast.warning(rs.message);
            }
          })
        }
      }
      )
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

}
