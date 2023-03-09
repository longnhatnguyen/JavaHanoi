
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, lastValueFrom, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogService } from '../../../../service/confirm-dialog.service';
import { CategoryService } from '../../../../service/category.service';
import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ApiStorageConstant, FileImage } from 'src/app/modules/layout/shared/components/upload-file/fileupload-item';
import { UploadFileComponent } from 'src/app/modules/layout/shared/components/upload-file/upload-file.component';
import { formatDate } from '@angular/common';
import { RawMaterialArea } from '../modal/raw-matertial-area';
import { AddLocationMapComponent } from 'src/app/modules/layout/shared/components/add-location-map/add-location-map.component';
import { AppStatusCode, statusStore, typeStore } from 'src/app/common/const';

@Component({
  selector: 'app-modal-create-modify-category-store',
  templateUrl: './modal-create-modify-category-store.component.html',
  styleUrls: ['./modal-create-modify-category-store.component.scss']
})
export class ModalCreateModifyCategoryStoreComponent implements OnInit {

  @Input() itemDetail: any;
  @Output() itemSubmited: EventEmitter<any> = new EventEmitter();
  @ViewChild('fileUploadIcon', { static: true }) fileUploadIcon: UploadFileComponent;
  @ViewChild('addMapModal', { static: false }) addMapModal: AddLocationMapComponent;

  listStatus = statusStore;
  listType = typeStore;
  fileImage: FileImage[] = [];
  formGroupCreate!: FormGroup;

  constructor(
    private categoryService: CategoryService,
    public modal: NgbActiveModal,
    public fb: FormBuilder,
    private toast: ToastrService,
    private confirmDialog: ConfirmDialogService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    console.log(this.itemDetail)
    this.initCreateForm();
    if (this.itemDetail) {
      this.categoryService.getCategoryStoreDetail(this.itemDetail.id).subscribe(res => {
        this.itemDetail = res.data;
        this.itemDetail.opening_day = new Date(this.itemDetail.opening_day)
        this.setValue(this.itemDetail);
        this.fileImage = (this.itemDetail['files']);
        this.fileUploadIcon.onLoadImage(this.fileImage);
        this.location = JSON.stringify({ 'lng': this.formGroupCreate.value.lng, 'lat': this.formGroupCreate.value.lat });
        this.locationShow = '(' + this.formGroupCreate.value.lng + ',' + this.formGroupCreate.value.lat + ')';

      })
    } else {
      // this.initCreateForm();
    }
  }

  input: RawMaterialArea = new RawMaterialArea();
  locationShow: any;
  location: any;
  getCoordinate($event): void {
    if ($event) {
      this.input.map = $event['lng'] + ';' + $event['lat']
      this.location = $event;

      // this.formGroupCreate.value.lat = $event['lat'].toString()
      // this.formGroupCreate.value.lng = $event['lng'].toString()

      this.formGroupCreate.controls['lat'].setValue($event['lat'].toString());
      this.formGroupCreate.controls['lng'].setValue($event['lng'].toString());
    }
  }

  initCreateForm() {
    this.formGroupCreate = this.fb.group({
      id: 0,
      address: ['', [Validators.required]],
      name: ['', [Validators.required]],
      capital_value: ['', [Validators.required]],
      brand_value: ['', [Validators.required]],
      acreage: ['', [Validators.required]],
      lat: [''],
      lng: [''],
      type: [null, [Validators.required]],
      note: "",
      status: [null, [Validators.required]],
      status_name: ["", [Validators.required]],
      opening_day: ['', [Validators.required]],
    })
  }

  setValue(category: any) {
    this.formGroupCreate?.patchValue(category);
    // this.formGroupCreate.get('opening_day').setValue(formatDate(this.itemDetail.opening_day, 'yyyy-MM-dd', 'en'))
  }

  updateStatusName(event) {
    this.formGroupCreate.controls['status_name'].setValue(this.listStatus.find(obj => {
      return obj.id == event.target.value
    }).name);
  }

  get lf() {
    return this.formGroupCreate?.controls;
  }

  close(): void {
    this.modal.close();
  }

  async save() {
    // if (this.formGroupCreate.invalid) {
    //   return;
    // }
    this.formGroupCreate.value.status = parseInt(this.formGroupCreate.value.status)
    if (!this.itemDetail)//thêm mới
    {
      let upload = await this.fileUploadIcon.onUploadFile();
      if (upload != null) {
        let file = await lastValueFrom(await upload);
        this.formGroupCreate.value.files = file;
      } else {
        this.formGroupCreate.value.files = undefined;
      }
      this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn tạo mới bản ghi này ?')
        .then((confirmed) => {
          if (confirmed) {
            this.categoryService.createCategoryStore(this.formGroupCreate.value).subscribe(rs => {
              if (rs.statusCode == 200) {
                this.toast.success(rs.message);
                this.itemSubmited.emit(rs.data);
                this.close()
              } else {
                this.toast.warning(rs.message);
              }
            });
          }
        }
        )
        .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }
    else//sửa
    {
      let upload = await this.fileUploadIcon.onUploadFile(true);
      if (upload != null) {
        let file = await lastValueFrom(await upload);
        this.formGroupCreate.value.files = file;
      } else {
        this.formGroupCreate.value.files = undefined;
      }

      this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn sửa bản ghi này ?')
        .then((confirmed) => {
          if (confirmed) {
            this.categoryService.modifyCategoryStore(this.formGroupCreate.value).subscribe(rs => {
              if (rs.statusCode == 200) {
                this.toast.success(rs.message);
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
