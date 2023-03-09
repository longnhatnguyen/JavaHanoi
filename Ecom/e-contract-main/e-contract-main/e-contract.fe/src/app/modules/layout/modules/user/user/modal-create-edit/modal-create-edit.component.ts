import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { delay, forkJoin, lastValueFrom } from 'rxjs';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectionStrategy } from '@angular/compiler';
import { LocationService } from '../../../../service/location.service';
import { UserService } from '../../../../service/user.service';
import { ConfirmDialogService } from '../../../../service/confirm-dialog.service';
import { UploadFileComponent } from 'src/app/modules/layout/shared/components/upload-file/upload-file.component';
import { FileImage } from 'src/app/modules/layout/shared/components/upload-file/fileupload-item';
import { AuthService } from 'src/app/modules/auth';

@Component({
  selector: 'app-modal-create-edit',
  templateUrl: './modal-create-edit.component.html',
  styleUrls: ['./modal-create-edit.component.scss']
})
export class ModalCreateEditComponent implements OnInit {

  @Input() user: Array<any> = [];
  @Input() itemDetail: any;
  @Output() itemSubmited: EventEmitter<any> = new EventEmitter();
  @ViewChild('fileUploadIcon', { static: true }) fileUploadIcon: UploadFileComponent;

  formGroupCreate!: FormGroup;
  isCreate: boolean = true;
  confirmPassword = {
    error: false,
    value: null
  };

  active = false;

  provinces: any[] = [];
  selectedProvince: any;
  selectedProvinceTempt: any;
  districts: any[] = [];
  selectedDistrict: any;
  selectedDistrictTempt: any;
  wards: any[] = [];
  selectedWard: any;
  selectedWardTempt: any;

  formSubmitted = false;
  listSex = [{
    id: 0,
    name: 'Nam',
  }, {
    id: 1,
    name: 'Nữ',
  }];

  listStatus = [{
    status: true,
    name: 'Kích hoạt',
  }, {
    status: false,
    name: 'Bị khóa',
  }]
  fileImage: FileImage[] = [];

  constructor(
    private userService: UserService,
    public modal: NgbActiveModal,
    private _locationService: LocationService,
    public fb: FormBuilder,
    private toast: ToastrService,
    private confirmDialog: ConfirmDialogService,
    private cdr: ChangeDetectorRef,
    private _auth: AuthService,
  ) { }

  ngOnInit() {
    if (this.itemDetail) {
      this.active = true;
      this.initModifyForm();
      forkJoin([
        this._locationService.GetProvices(),
        this._locationService.GetDistrictsByProvince(this.itemDetail.province_id),
        this._locationService.GetWatdsByDistrict(this.itemDetail.district_id)
      ]).pipe(delay(0)).subscribe(([provinces, districts, wards]) => {
        try {
          if (provinces.data.length > 0) {
            this.handleProvineData(provinces);
          }
          if (districts.data.length > 0) {
            this.handleDistrictData(districts);
          }
          if (wards.data.length > 0) {
            this.handleWardData(wards);
          }
        }
        catch (err) {
          console.log("error")
        }
        finally {
          this.itemDetail.birthday = new Date(this.itemDetail.birthday)
          this.setValue(this.itemDetail);

          this.fileImage.push(this.itemDetail['image']);
          this.fileUploadIcon.onLoadImage(this.fileImage);
          // this.itemDetail.birthday = new Date(this.itemDetail.birthday)
          // requestShop.data.transfer_date = new Date(requestShop.data.transfer_date)
        }
      })
      this.cdr.detectChanges()
    } else {
      this.initCreateForm()
      this.getProvinces()
    }
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  initCreateForm() {
    this.formGroupCreate = this.fb.group({
      id: [0],
      code: [''],
      username: ['', [Validators.required, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      pass_code: [''],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(14)]],
      landline_number: [''],
      full_name: ['', [Validators.required, Validators.maxLength(50)]],
      address: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      province_id: [2],
      district_id: [2],
      ward_id: [2],
      sex: [null],
      is_active: [true],
      type: [0],
    })
  }

  initModifyForm() {
    this.formGroupCreate = this.fb.group({
      id: [''],
      code: [''],
      username: ['', [Validators.required, Validators.maxLength(50)]],
      email: [Validators.required, Validators.email],
      phone_number: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(14)]],
      full_name: ['', [Validators.required, Validators.maxLength(50)]],
      address: [Validators.required],
      birthday: ['', [Validators.required]],
      province_id: [''],
      district_id: [''],
      ward_id: [''],
      sex: [''],
      is_active: [''],
      type: [''],
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

  getProvinces(): void {
    this._locationService.GetProvices().subscribe(res => {

      if (res.statusCode == 200) {
        this.handleProvineData(res);
      } else {
        this.toast.warning(res.message);
      }
    });
  }

  handleProvineData(provinces: any) {
    let data = provinces['data'];
    this.provinces = [];
    this.districts = [];
    this.wards = [];
    data.forEach((element: any) => {
      this.provinces.push({ 'value': element.id, 'label': element.city });
    });
  }

  getDistrictByProvince(data: any): void {
    if (data.target.value) {
      this._locationService.GetDistrictsByProvince(data.target.value).subscribe(res => {
        this.handleDistrictData(res)
      });
    }
  }

  handleDistrictData(districts: any) {
    let data = districts['data'];
    this.districts = [];
    this.wards = [];
    data.forEach((element: any) => {
      this.districts.push({ 'value': element.id, 'label': element.name });
    });
  }

  getWardsByDistrict(data: any): void {
    if (data.target.value) {
      this._locationService.GetWatdsByDistrict(data.target.value).subscribe(res => {
        this.handleWardData(res)
      });
    }
  }

  handleWardData(ward: any) {
    let data = ward['data'];
    this.wards = [];
    data.forEach((element: any) => {
      this.wards.push({ 'value': element.id, 'label': element.name });
    });
  }

  async save() {
    this.formSubmitted = true;
    this.confirmPassword.error = false;
    if (!this.itemDetail) {
      if (this.confirmPassword.value != this.formGroupCreate.value.password) {
        this.confirmPassword.error = true;
        return;
      }
    }
    if (this.formGroupCreate.invalid) {
      return;
    }
    this.formGroupCreate.value.province_id = parseInt(this.formGroupCreate.value.province_id)
    this.formGroupCreate.value.district_id = parseInt(this.formGroupCreate.value.district_id)
    this.formGroupCreate.value.ward_id = parseInt(this.formGroupCreate.value.ward_id)
    if (!this.itemDetail) {
      let upload = await this.fileUploadIcon.onUploadFile();
      if (upload != null) {
        let file = await lastValueFrom(this.fileUploadIcon.onUploadFile());
        this.formGroupCreate.value.image = file[0];
      } else {
        this.formGroupCreate.value.image = undefined;
      }
      this.userService.createUser(this.formGroupCreate.value).subscribe(rs => {

        if (rs.statusCode == 200) {
          this.toast.success("Thêm mới user thành công !");
          this.itemSubmited.emit(rs.data);
          this.close()
        } else {
          this.toast.warning(rs.message);
        }
      })
    } else {
      let upload = await this.fileUploadIcon.onUploadFile(true);
      if (upload != null) {
        let file = await lastValueFrom(await upload);
        this.formGroupCreate.value.image = file[0];
      } else {
        this.formGroupCreate.value.image = undefined;
      }
      // this._auth.setCurrentUserSubjectValue(this.formGroupCreate.value.full_name, this.formGroupCreate.value.image.path);
      this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn sửa bản ghi này')
        .then((confirmed) => {
          if (confirmed) {
            this.userService.modifyUser(this.formGroupCreate.value).subscribe(rs => {

              if (rs.statusCode == 200) {
                this._auth.setCurrentUserSubjectValue(this.formGroupCreate.value.id, this.formGroupCreate.value.full_name, this.formGroupCreate.value.image);
                this.toast.success("Cập nhật user thành công !");
                this.itemSubmited.emit(rs.data);
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
