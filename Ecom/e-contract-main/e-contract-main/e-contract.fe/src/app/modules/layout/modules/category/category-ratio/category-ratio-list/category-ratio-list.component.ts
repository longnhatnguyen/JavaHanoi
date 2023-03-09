import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogService } from '../../../../service/confirm-dialog.service';
import { CategoryService } from '../../../../service/category.service';
import { ModalCreateModifyCategoryRatioComponent } from '../modal-create-modify-category-ratio/modal-create-modify-category-ratio.component';

@Component({
  selector: 'app-category-ratio-list',
  templateUrl: './category-ratio-list.component.html',
  styleUrls: ['./category-ratio-list.component.scss']
})
export class CategoryRatioListComponent implements OnInit {

  stt: number = 0;
  totalRows: number = 0;

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
      keyword: '',
      page_number: 1,
      page_size: 20,
    })
  }

  search() {
    this.getListCategory();
  }

  reset() {
    this.formGroupCreate = this.fb.group({
      keyword: '',
      page_number: 1,
      page_size: 20,
    })
    this.getListCategory()
  }

  getListCategory(): void {
    this.categoryService.getListCategoryRatio(this.formGroupCreate.value).subscribe(rs => {
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
    const dialogRef = this.modalService.open(ModalCreateModifyCategoryRatioComponent,
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
          this.categoryService.deleteCategoryRatio(category.id).subscribe(rs => {
            if (rs.statusCode == 200) {
              this.toast.success("Xóa tỉ lệ vốn thành công !");
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
