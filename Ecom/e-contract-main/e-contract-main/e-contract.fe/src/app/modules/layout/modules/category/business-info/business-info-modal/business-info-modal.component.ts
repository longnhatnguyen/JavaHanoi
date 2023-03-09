import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/modules/layout/service/category.service';
import { ConfirmDialogService } from 'src/app/modules/layout/service/confirm-dialog.service';

@Component({
  selector: 'app-business-info-modal',
  templateUrl: './business-info-modal.component.html',
  styleUrls: ['./business-info-modal.component.scss']
})
export class BusinessInfoModalComponent implements OnInit {

  @Input() itemDetail: any;
  @Output() itemSubmited: EventEmitter<any> = new EventEmitter();
  formGroupCreate!: FormGroup;
  confirmPassword = {
    error: false,
    value: false
  };

  constructor(
    private categoryService: CategoryService,
    public modal: NgbActiveModal,
    public fb: FormBuilder,
    private toast: ToastrService,
    private confirmDialog: ConfirmDialogService,
  ) { }

  ngOnInit(): void {
    this.initCreateForm();
    if(this.itemDetail){
      this.itemDetail.date = new Date(this.itemDetail.date);
      this.setValue(this.itemDetail)
    }

  }

  initCreateForm() {
    this.formGroupCreate = this.fb.group({
      id: [0],
      revenue: ['', [Validators.required]],
      funds: ['', [Validators.required]],
      cost: ['', [Validators.required]],
      date: ['', [Validators.required]],
      profit: ['', [Validators.required]]
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
      this.categoryService.BusinessInfo().add(this.formGroupCreate.value).subscribe(rs => {
        if (rs.statusCode == 200) {
          this.toast.success("Thêm mới thành công !");
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
            this.categoryService.BusinessInfo().edit(this.formGroupCreate.value).subscribe(rs => {
              if (rs.statusCode == 200) {
                this.toast.success("Chỉnh sửa thành công !");
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
