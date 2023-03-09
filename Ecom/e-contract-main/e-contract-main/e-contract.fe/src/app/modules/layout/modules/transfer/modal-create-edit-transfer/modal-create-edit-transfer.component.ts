import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { delay, forkJoin, lastValueFrom } from 'rxjs';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectionStrategy } from '@angular/compiler';
import { TransferService } from 'src/app/modules/layout/service/transfer.service';
import { CustomerService } from 'src/app/modules/layout/service/customer.service';
import { ContractService } from 'src/app/modules/layout/service/contract.service';
import { ApiStorageConstant, FileImage } from 'src/app/modules/layout/shared/components/upload-file/fileupload-item';
import { UploadFileComponent } from 'src/app/modules/layout/shared/components/upload-file/upload-file.component';
import { AuthService } from 'src/app/modules/auth';
import { ConfirmDialogService } from '../../../service/confirm-dialog.service';

@Component({
  selector: 'app-modal-create-edit-transfer',
  templateUrl: './modal-create-edit-transfer.component.html',
  styleUrls: ['./modal-create-edit-transfer.component.scss']
})
export class ModalCreateEditTransferComponent implements OnInit {

  @Input() customerList: Array<any> = [];
  @Input() contractList: Array<any> = [];
  @Input() itemDetail: any;
  @Input() formOption: "add" | "edit" | "show";
  @Output() itemSubmited: EventEmitter<any> = new EventEmitter();
  @ViewChild('fileUploadIcon', { static: true }) fileUploadIcon: UploadFileComponent;

  fileImage: FileImage[] = [];
  formGroupCreate!: FormGroup;
  formDisabled: boolean;
  constructor(
    private transferService: TransferService,
    public modal: NgbActiveModal,
    public fb: FormBuilder,
    private toast: ToastrService,
    private confirmDialog: ConfirmDialogService,
    private cdr: ChangeDetectorRef,
  ) {


  }

  ngOnInit(): void {
    if (this.formOption === "edit" || this.formOption === "add") {
      this.formDisabled = false;
    } else {
      this.formDisabled = true;
    }

    this.initCreateForm();
    if (this.formOption === 'edit' || this.formOption === 'show') {
      this.transferService.getTransferDetail(this.itemDetail.id).subscribe(res => {
        this.initCreateForm();
        this.itemDetail = res.data;
        this.setValue(this.itemDetail);
        if (this.itemDetail?.image) {
          this.fileImage.push(this.itemDetail['image']);
        }
        this.fileUploadIcon.onLoadImage(this.fileImage);
      })
    } else {
      this.initCreateForm();
      this.setValue(this.itemDetail);
    }
  }

  initCreateForm() {
    this.formGroupCreate = this.fb.group({
      customer_id: [null, [Validators.required]],
      contract_id: [null, [Validators.required]],
      transfer_content: [{ value: '', disabled: this.formDisabled }],
      bank_account: [{ value: '', disabled: this.formDisabled }, [Validators.required]],
      bank_name: [{ value: '', disabled: this.formDisabled }, [Validators.required]],
      transfer_amount: [{ value: '', disabled: this.formDisabled }, [Validators.required]],
      id: 0,
      is_delete: false,
    })
  }

  setValue(user: any) {
    this.formGroupCreate?.patchValue(user);
    // this.formGroupCreate.get('birthday').setValue(formatDate(this.itemDetail.birthday, 'yyyy-MM-dd', 'en'))
  }

  get lf() {
    return this.formGroupCreate?.controls;
  }

  close(): void {
    this.modal.close();
  }

  async save() {
    if (this.formGroupCreate.invalid) {
      return;
    }

    if (this.formOption === 'add')//thêm mới
    {
      let upload = await this.fileUploadIcon.onUploadFile();
      if (upload != null) {
        let file = await lastValueFrom(this.fileUploadIcon.onUploadFile());
        this.formGroupCreate.value.image = file[0];
        this.formGroupCreate.value.status = 1;
      } else {
        this.formGroupCreate.value.image = undefined;
      }
      this.transferService.createTransfer(this.formGroupCreate.value).subscribe(rs => {
        if (rs.statusCode == 200) {
          this.toast.success("Tạo mới phiên chuyển tiền thành công !");
          this.itemSubmited.emit(rs.data);
          this.close()
        } else {
          this.toast.warning(rs.message);
        }
      });
    }
    else//sửa
      if (this.formOption === "edit") {
        let upload = await this.fileUploadIcon.onUploadFile(true);
        if (upload != null) {
          let file = await lastValueFrom(await upload);
          this.formGroupCreate.value.image = file[0];
          this.formGroupCreate.value.status = 1;
        } else {
          this.formGroupCreate.value.image = undefined;
        }
        this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn sửa bản ghi này ?')
          .then((confirmed) => {
            if (confirmed) {
              this.transferService.ModifyTransfer(this.formGroupCreate.value).subscribe(rs => {
                if (rs.statusCode == 200) {
                  this.toast.success("Chỉnh sửa phiên chuyển tiền thành công !");
                  this.itemSubmited.emit(rs.data);
                  this.close()
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

}
