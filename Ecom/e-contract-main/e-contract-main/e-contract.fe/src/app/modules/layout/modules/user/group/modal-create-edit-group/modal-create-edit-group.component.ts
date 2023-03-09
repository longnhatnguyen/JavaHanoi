import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { LocationService } from '../../../../service/location.service';
import { UserService } from '../../../../service/user.service';
import { ConfirmDialogService } from '../../../../service/confirm-dialog.service';

@Component({
  selector: 'app-modal-create-edit-group',
  templateUrl: './modal-create-edit-group.component.html',
  styleUrls: ['./modal-create-edit-group.component.css']
})
export class ModalCreateEditGroupComponent implements OnInit {

  @Input() group: Array<any>;
  @Input() itemDetail: any;
  @Output() itemSubmited: EventEmitter<any> = new EventEmitter();

  formGroupCreate: FormGroup;
  isCreate: boolean = true;
  formSubmitted = false;

  listStatus = [{
    status: true,
    name: 'Tạm ngừng',
  }, {
    status: false,
    name: 'Kích hoạt',
  }]
  constructor(
    private userService: UserService,
    public modal: NgbActiveModal,
    private _locationService: LocationService,
    public fb: FormBuilder,
    private toast: ToastrService,
    private confirmDialog: ConfirmDialogService
  ) { }

  ngOnInit(): void {
    if (!!this.itemDetail) {
      this.initCreateForm();
      this.setValue(this.itemDetail)
    } else {
      this.initCreateForm();
    }
  }

  initCreateForm() {
    this.formGroupCreate = this.fb.group({
      id: [0],
      is_delete: [false],
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      note: [''],
    })
  }

  setValue(group: any) {
    this.formGroupCreate.patchValue(group);
  }

  save() {
    this.formSubmitted = true;
    if (this.formGroupCreate.invalid) {
      return;
    }
    if (!this.itemDetail) {
      this.userService.adminGroupCreateUrl(this.formGroupCreate.value).subscribe(rs => {
        if (rs.statusCode == 200) {
          this.toast.success("Thêm mới nhóm thành công !");
          this.itemSubmited.emit(rs.data);
          this.close()
        } else {
          this.toast.warning(rs.message);
        }
      })
    } else {
      this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn sửa bản ghi này')
        .then((confirmed) => {
          if (confirmed) {
            this.userService.adminGroupModifyUrl(this.formGroupCreate.value).subscribe(rs => {
              if (rs.statusCode == 200) {
                this.toast.success("Cập nhật nhóm thành công !");
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

  close(): void {
    this.modal.close();
  }

}
