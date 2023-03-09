import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogService } from '../../../../service/confirm-dialog.service';
import { CategoryService } from '../../../../service/category.service';
import { ModalCreateModifyCategoryStoreComponent } from '../modal-create-modify-category-store/modal-create-modify-category-store.component';
import { mapArrayForDropDown, statusStore, typeStore } from 'src/app/common/const';
import { AuthService } from 'src/app/modules/auth';

@Component({
  selector: 'app-category-store-list',
  templateUrl: './category-store-list.component.html',
  styleUrls: ['./category-store-list.component.scss']
})
export class CategoryStoreListComponent implements OnInit {

  stt: number = 0;
  totalRows: number = 0;

  formGroupCreate: FormGroup;
  categoryList: any[];

  statusStore = mapArrayForDropDown(statusStore, 'name', 'id');
  typeStore = mapArrayForDropDown(typeStore, 'name', 'id');
  constructor(
    private categoryService: CategoryService,
    private modalService: NgbModal,
    private confirmDialog: ConfirmDialogService,
    private fb: FormBuilder,
    private toast: ToastrService,
    public _router: Router,
    private _auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.initFormGroupCreate();
    this.getListCategoryStore()
  }

  initFormGroupCreate() {
    this.formGroupCreate = this.fb.group({
      keyword: '',
      status: '',
      type: '',
      page_number: 1,
      page_size: 20,
    })
  }

  search() {
    this.getListCategoryStore();
  }

  reset() {
    this.formGroupCreate = this.fb.group({
      keyword: '',
      status: 0,
      type: 0,
      page_number: 1,
      page_size: 20,
    })
    this.getListCategoryStore()
  }

  getListCategoryStore(): void {
    this.categoryService.getListCategoryStore({
      ...this.formGroupCreate.value,
      status: this.formGroupCreate.value.status == null ? '' : this.formGroupCreate.value.status,
      type: this.formGroupCreate.value.type == null ? '' : this.formGroupCreate.value.type,
    }).subscribe(rs => {
      this.totalRows = rs.data.totalcount;
      this.categoryList = rs.data.lists;
      this.stt = this.formGroupCreate.value.page_size * (rs.data.page - 1);
      this.categoryList.forEach(obj => {
        obj.type_name = typeStore.find(ele => ele.id == obj.type).name;
      })
    })
  }

  onChangedPage(event: any): void {
    this.formGroupCreate.value.page_number = event.page;
    this.getListCategoryStore();
  }

  openCreateModifyCategoryModal(item?: any, index?: any) {
    const dialogRef = this.modalService.open(ModalCreateModifyCategoryStoreComponent,
      {
        size: 'lg',
      });
    dialogRef.componentInstance.itemDetail = item || null;
    dialogRef.componentInstance.itemSubmited.subscribe((res?: any) => {
      if (res) {
        this.getListCategoryStore();
      }
    });
  }

  viewDetailCategoryStore(item?: any, index?: any) {
    this._router.navigate([`/category/view-detail-category-store/${item.id}`])
  }

  deleteCategory(category: any) {
    this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn xóa bản ghi này ?')
      .then((confirmed) => {
        if (confirmed) {
          this.categoryService.deleteCategoryStore(category.id).subscribe(rs => {
            if (rs.statusCode == 200) {
              this.toast.success("Xóa tỉ lệ vốn thành công !");
              this.getListCategoryStore();
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
