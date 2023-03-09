
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, lastValueFrom, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogService } from '../../../../service/confirm-dialog.service';
import { CategoryService } from '../../../../service/category.service';
import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ApiStorageConstant, FileImage } from 'src/app/modules/layout/shared/components/upload-file/fileupload-item';
import { UploadFileComponent } from 'src/app/modules/layout/shared/components/upload-file/upload-file.component';
import { formatDate } from '@angular/common';
import { RawMaterialArea } from '../modal/raw-matertial-area';
import { AddLocationMapComponent } from 'src/app/modules/layout/shared/components/add-location-map/add-location-map.component';
import { Configuration } from 'src/app/modules/layout/shared/config/configuration';
import { AuthService } from 'src/app/modules/auth';
import { AppStatusCode, typeStore } from 'src/app/common/const';

@Component({
  selector: 'app-view-detail-category-store',
  templateUrl: './view-detail-category-store.component.html',
  styleUrls: ['./view-detail-category-store.component.scss']
})
export class ViewDetailCategoryStoreComponent implements OnInit {

  @Input() itemDetail: any;
  @Output() itemSubmited: EventEmitter<any> = new EventEmitter();
  @ViewChild('fileUploadIcon', { static: true }) fileUploadIcon: UploadFileComponent;

  @ViewChild('addMapModal', { static: false }) addMapModal: AddLocationMapComponent;
  url = this.config.ApiUrl + ApiStorageConstant.fileImageUrl;
  loading = true;

  id;
  fileImage: FileImage[] = [];
  formGroupCreate!: FormGroup;
  customer_id;

  constructor(
    private categoryService: CategoryService,
    public modal: NgbActiveModal,
    public fb: FormBuilder,
    private toast: ToastrService,
    private confirmDialog: ConfirmDialogService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private config: Configuration,
    private _auth: AuthService,
  ) {
    if (JSON.parse(this._auth.currentUserValue).role == 'admin') {
      this.customer_id = 0
    } else {
      this.customer_id = JSON.parse(this._auth.currentUserValue).id;
    }
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.id = params.id;
      this.initCreateForm();
      if (this.id) {
        this.categoryService.getCategoryStoreDetail(this.id).subscribe(res => {
          this.initCreateForm();
          this.itemDetail = res.data;
          this.setValue(this.itemDetail);
          // this.fileImage = (this.itemDetail['files']);
          // this.fileUploadIcon.onLoadImage(this.fileImage);

          this.location = JSON.stringify({ 'lng': this.formGroupCreate.value.lng, 'lat': this.formGroupCreate.value.lat });
          this.locationShow = '(' + this.formGroupCreate.value.lng + ',' + this.formGroupCreate.value.lat + ')';

          this.itemDetail.type_name = typeStore.find(ele => ele.id == this.itemDetail.status).name;

          this.loading = false;
        })
      }
    })
  };

  input: RawMaterialArea = new RawMaterialArea();
  locationShow: any;
  location: any;
  getCoordinate($event): void {
    if ($event) {
      this.input.map = $event['lng'] + ';' + $event['lat']
      this.location = $event;

      this.formGroupCreate.value.lat = $event['lat'].toString()
      this.formGroupCreate.value.lng = $event['lng'].toString()
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
      note: "",
      status: [1, [Validators.required]],
      status_name: ["Kích hoạt", [Validators.required]],
      opening_day: ['', [Validators.required]],
    })
  }

  setValue(category: any) {
    this.formGroupCreate?.patchValue(category);
    this.formGroupCreate.get('opening_day').setValue(formatDate(this.itemDetail.opening_day, 'yyyy-MM-dd', 'en'))
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

    try {
      let upload = await this.fileUploadIcon.onUploadFile();
      if (upload != null) {
        let file = await (this.fileUploadIcon.onUploadFile()).toPromise();
        this.formGroupCreate.value.files = file;
      } else {
        this.formGroupCreate.value.files = undefined;
      }
    } catch {
      this.toast.warning("Kích thước của file vượt quá giới hạn cho phép !!!");
      return;
    }

    if (!this.itemDetail)//thêm mới
    {
      this.categoryService.createCategoryStore(this.formGroupCreate.value).subscribe(rs => {
        if (rs.statusCode == 200) {
          this.toast.success(rs.message);
        } else {
          this.toast.warning(rs.message);
        }
      });
    }
    else//sửa
    {

      this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn sửa bản ghi này ?')
        .then((confirmed) => {
          if (confirmed) {
            this.categoryService.modifyCategoryStore(this.formGroupCreate.value).subscribe(rs => {
              if (rs.statusCode == 200) {
                this.toast.success(rs.message);
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
