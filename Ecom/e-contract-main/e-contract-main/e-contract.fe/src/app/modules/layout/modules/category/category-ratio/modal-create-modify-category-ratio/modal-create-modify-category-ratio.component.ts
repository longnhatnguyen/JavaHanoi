import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { delay, forkJoin } from 'rxjs';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectionStrategy } from '@angular/compiler';
import { listBank } from 'src/app/common/const';
import { ConfirmDialogService } from '../../../../service/confirm-dialog.service';
import { CategoryService } from '../../../../service/category.service';

@Component({
  selector: 'app-modal-create-modify-category-ratio',
  templateUrl: './modal-create-modify-category-ratio.component.html',
  styleUrls: ['./modal-create-modify-category-ratio.component.scss']
})
export class ModalCreateModifyCategoryRatioComponent implements OnInit {

  @Input() category: Array<any> = [];
  @Input() itemDetail: any;
  @Output() itemSubmited: EventEmitter<any> = new EventEmitter();
  formGroupCreate!: FormGroup;
  confirmPassword = {
    error: false,
    value: false
  };
  listBank = listBank;

  constructor(
    private categoryService: CategoryService,
    public modal: NgbActiveModal,
    public fb: FormBuilder,
    private toast: ToastrService,
    private confirmDialog: ConfirmDialogService,
  ) { }

  ngOnInit(): void {
    this.initCreateForm();
    this.itemDetail && this.setValue(this.itemDetail)
  }

  initCreateForm() {
    this.formGroupCreate = this.fb.group({
      id: [0],
      is_delete: false,
      name: ['', [Validators.required, Validators.maxLength(50)]],
      note: "",
      capital_value: ['', [Validators.required]],
      price: ['', [Validators.required]],
      income: ['', [Validators.required]],
    })
  }

  setValue(category: any) {
    this.formGroupCreate?.patchValue(category);
  }

  close(): void {
    this.modal.close();
  }

  get lf() {
    return this.formGroupCreate?.controls;
  }

  save() {
    if (this.formGroupCreate.invalid) {
      return;
    }
    if (!this.itemDetail) {
      this.categoryService.createCategoryRatio(this.formGroupCreate.value).subscribe(rs => {
        if (rs.statusCode == 200) {
          this.toast.success("Thêm mới tỉ lệ vốn thành công !");
          this.itemSubmited.emit(rs);
          this.close()
        } else {
          this.toast.warning(rs.message);
        }
      })
    } else {
      this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn sửa bản ghi này')
        .then((confirmed) => {
          if (confirmed) {
            this.categoryService.modifyCategoryRatio(this.formGroupCreate.value).subscribe(rs => {
              if (rs.statusCode == 200) {
                this.toast.success("Chỉnh sửa tỉ lệ vốn thành công !");
                this.itemSubmited.emit(rs);
                this.close()
              } else {
                this.toast.warning(rs.message);
              }
            })
          }
        })
        .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }
  }
}
