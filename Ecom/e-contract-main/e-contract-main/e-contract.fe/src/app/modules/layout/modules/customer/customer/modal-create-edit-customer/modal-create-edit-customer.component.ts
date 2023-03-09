import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { delay, forkJoin, lastValueFrom } from 'rxjs';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectionStrategy } from '@angular/compiler';
import { ConfirmDialogService } from '../../../../service/confirm-dialog.service';
import { CustomerService } from '../../../../service/customer.service';
import { listBank, mapArrayForDropDown } from 'src/app/common/const';
import { AuthService } from 'src/app/modules/auth';
import { UploadFileComponent } from 'src/app/modules/layout/shared/components/upload-file/upload-file.component';
import { FileImage } from 'src/app/modules/layout/shared/components/upload-file/fileupload-item';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modal-create-edit-customer',
  templateUrl: './modal-create-edit-customer.component.html',
  styleUrls: ['./modal-create-edit-customer.component.scss']
})
export class ModalCreateEditCustomerComponent implements OnInit {

  @Input() customer: Array<any> = [];
  @Input() itemDetail: any;
  @Output() itemSubmited: EventEmitter<any> = new EventEmitter();
  @ViewChild('fileUploadIcon', { static: true }) fileUploadIcon: UploadFileComponent;
  formGroupCreate!: FormGroup;
  listBank = mapArrayForDropDown(listBank.map(ele=>{
    return {name:ele.name, nameShow:`${ele.name} - ${ele.code}`}
  }), 'nameShow', 'name');
  role = localStorage.getItem('role');
  disable = false;
  id;
  fileImage: FileImage[] = [];

  constructor(
    private customerService: CustomerService,
    public modal: NgbActiveModal,
    public fb: FormBuilder,
    private toast: ToastrService,
    private confirmDialog: ConfirmDialogService,
    private _auth: AuthService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {

    this.activatedRoute.params.subscribe((params: any) => {
      this.id = params.id;
      this.initCreateForm();
      if (this.id) {
        this.customerService.getCustomerDetail(this.id).subscribe(res => {
          this.itemDetail = res.data;
          this.itemDetail.birthday && (this.itemDetail.birthday = new Date(this.itemDetail.birthday))
          this.itemDetail && this.setValue(this.itemDetail)
          // console.log(this.itemDetail)
          // console.log(new Object(this.itemDetail?.image).hasOwnProperty('path'))
          if (this.itemDetail?.image) {
            this.fileImage.push(this.itemDetail['image']);
            this.fileUploadIcon.onLoadImage(this.fileImage);
          } else {
            this.fileImage = []
          }
        })
      }
    })
  }

  initCreateForm() {
    this.formGroupCreate = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(14)]],
      is_delete: false,
      address: [''],
      identity: ['', [Validators.required, Validators.maxLength(20)]],
      birthday: ['', [Validators.required]], 
      taxcode: [''],
      username: ['', [Validators.required, Validators.maxLength(50)]],
      code: [''],
      referral_code: [''],
      banks: this.fb.array([]),
    })
    if (!this.id) {
      this.addBanks();
    }
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  setValue(customer: any) {
    this.formGroupCreate?.patchValue(customer);
    // this.formGroupCreate.get('birthday').setValue(formatDate(this.itemDetail.birthday, 'yyyy-MM-dd', 'en'))
    this.setBankValue(customer.banks)
  }

  get listBankArray(): FormArray {
    return this.formGroupCreate.get('banks') as FormArray;
  }

  setBankValue(listBank) {
    const controls = this.listBankArray;
    listBank.forEach(item => {
      controls.push(
        this.fb.group({
          ...item
        })
      )
    });
  }

  addBanks() {
    this.listBankArray.push(this.fb.group({
      id: 0,
      is_delete: false,
      bank_name: "",
      bank_account: "",
      customer_id: this.itemDetail ? this.itemDetail.id : 0
    }))
  }

  removeBanks(index: number) {
    if (this.itemDetail) {
      if (this.listBankArray.value[index].id != 0) {
        this.listBankArray.value[index].is_delete = true;
        let data = this.listBankArray.value[index];
        this.listBankArray.removeAt(index);
        this.setBankValue([data])
      } else {
        this.listBankArray.removeAt(index);
      }
    } else {
      this.listBankArray.removeAt(index);
    }
  }

  close(): void {
    this.modal.close();
  }

  get lf() {
    return this.formGroupCreate?.controls;
  }

  async save() {
    if (this.formGroupCreate.invalid) {
      return;
    }
    if (!this.itemDetail) {
      let upload = await this.fileUploadIcon.onUploadFile();
      if (upload != null) {
        let file = await lastValueFrom(this.fileUploadIcon.onUploadFile());
        this.formGroupCreate.value.image = file[0];
      } else {
        this.formGroupCreate.value.image = undefined;
      }
      this.customerService.createCustomer(this.formGroupCreate.value).subscribe(rs => {
        if (rs.statusCode == 200) {
          this.toast.success("Thêm mới khách hàng thành công !");
          this.itemSubmited.emit(rs);
          this.close()
        } else {
          this.toast.warning(rs.message);
        }
      })
    } else {
      let upload = await this.fileUploadIcon.onUploadFile(true);
      console.log(upload)
      if (upload != null) {
        let file = await lastValueFrom(await upload);
        this.formGroupCreate.value.image = file[0];
      } else {
        this.formGroupCreate.value.image = undefined;
      }
      console.log(this.formGroupCreate.value)
      this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn sửa bản ghi này')
        .then((confirmed) => {
          if (confirmed) {
            this.customerService.ModifyCustomer(this.formGroupCreate.value).subscribe(rs => {
              if (rs.statusCode == 200) {
                this._auth.setCurrentUserSubjectValue(this.formGroupCreate.value.id, this.formGroupCreate.value.name, this.formGroupCreate.value.image);
                // window.location.reload();
                this.toast.success("Chỉnh sửa thông tin khách hàng thành công !");
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
  async copyCode(){
    try {
      await navigator.clipboard.writeText(this.formGroupCreate.value.code);
      this.toast.success('Sao chép thành công!')
    } catch (err) {
    }
  }
}
