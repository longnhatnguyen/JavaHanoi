import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from 'src/app/modules/layout/service/config.service';
import { ConfirmDialogService } from 'src/app/modules/layout/service/confirm-dialog.service';
import { FileImage } from 'src/app/modules/layout/shared/components/upload-file/fileupload-item';
import { UploadFileComponent } from 'src/app/modules/layout/shared/components/upload-file/upload-file.component';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  @ViewChild('fileUploadIcon', { static: true }) fileUploadIcon: UploadFileComponent;
  formConfig: FormGroup;
  fileImage: FileImage[] = [];

  constructor(
    public fb: FormBuilder,
    private toast: ToastrService,
    private confirmDialog: ConfirmDialogService,
    private _config: ConfigService,
  ) { }

  ngOnInit(): void {
    this.initCreateForm();
    this.getItem();
  }

  initCreateForm() {
    this.formConfig = this.fb.group({
      id: 0,
      account_name: ['', [Validators.required]],
      bank_name: ['', [Validators.required]],
      account_number: ['', [Validators.required]],
      note: "",
      image: [],
      dateAdded: null,
      dateUpdated: null,
      is_delete: false,
      userAdded: 0,
      userUpdated: "",
    })
  }

  getItem() {
    this._config.getConfigDetail().subscribe(res => {
      this.formConfig.setValue(res.data);
      this.fileImage = ([res.data['image']]);
      this.fileUploadIcon.onLoadImage(this.fileImage);
    })
  }

  async save() {
    if (this.formConfig.invalid) {
      this.toast.warning("Yêu cầu nhập đầy đủ trường bắt buộc","Thông báo");
      return;
    }
    let upload = await this.fileUploadIcon.onUploadFile(true);
    if (upload != null) {
      let file = await lastValueFrom(await upload);
      file[0].id = 0;
      // file[0].idtable = 0;
      this.formConfig.value.image = file[0];
    } else {
      this.formConfig.value.image = undefined;
    }
    this._config.configUpdate(this.formConfig.value).subscribe(rs => {
      if (rs.statusCode == 200) {
        this.toast.success(rs.message);
      } else {
        this.toast.warning(rs.message);
      }
    })
  }

}
