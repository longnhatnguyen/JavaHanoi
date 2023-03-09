import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { LocationService } from '../../../service/location.service';
import { UserService } from '../../../service/user.service';
import { ConfirmDialogService } from '../../../service/confirm-dialog.service';
import { CategoryRoleList } from './roleList';

@Component({
  selector: 'app-modal-create-modify-group-role',
  templateUrl: './modal-create-modify-group-role.component.html',
  styleUrls: ['./modal-create-modify-group-role.component.scss']
})
export class ModalCreateModifyGroupRoleComponent implements OnInit {

  @Input() group;
  @Input() title: string;
  @Output() itemSubmited: EventEmitter<any> = new EventEmitter();

  roleList: Array<any>;
  groupRoleList;
  selectedRoleId;
  statusRoleList = [];
  categoryRoleList = [];

  formGroupCreate: FormGroup;
  isCreate: boolean = true;
  formSubmitted = false;
  stt: number = 0;
  displayItem = ''

  constructor(
    private userService: UserService,
    public modal: NgbActiveModal,
    private _locationService: LocationService,
    public fb: FormBuilder,
    private toast: ToastrService,
    private confirmDialog: ConfirmDialogService
  ) { }

  ngOnInit(): void {
    forkJoin([
      this.userService.adminRoleListUrl(),
      this.userService.adminRoleGroupListByGroupIdUrl(this.group.id)
    ]).subscribe(([roleList, groupRoleList]) => {
      this.roleList = roleList.data;
      this.groupRoleList = groupRoleList.data;
      this.handleData(this.roleList, this.groupRoleList)
      this.initCreateGroupRoleForm()
      this.setValueGroupRoleForm(this.groupRoleList)
    })
  }

  handleData(roleList, groupRoleList) {
    CategoryRoleList.forEach((obj, index) => {
      this.categoryRoleList.push({
        code: obj.code,
        name: obj.name,
        role: [],
        status: true,
      })
      roleList.forEach((ele) => {
        if (ele.code.includes(obj.code)) {
          this.categoryRoleList[index].role.push({
            name: ele.name,
            code: ele.code,
            status: false,
            role_id: ele.id
          })
        }
      })
    })

    // console.log(this.categoryRoleList)

    this.categoryRoleList.forEach((category, indexCategory) => {
      category.role.forEach((role, indexRole) => {
        this.groupRoleList.forEach((groupRole, indexGroupRole) => {
          if (groupRole.role_id == role.role_id) {
            role.status = true;
          }
        })
        role.status == false && (category.status = false);
      })
    })

    console.log(this.categoryRoleList)
  }

  showItem(name) {
    if (this.displayItem && this.displayItem == name) {
      this.displayItem = ''
    } else {
      this.displayItem = name;
    }
  }

  initCreateGroupRoleForm() {
    this.formGroupCreate = new FormGroup({
      data: this.fb.array([])
    })
  }

  setValueGroupRoleForm(groupRoleList) {
    console.log(groupRoleList)
    groupRoleList.forEach(obj => {
      this.roleArray.push(this.fb.group({
        id: obj.id,
        is_delete: obj.is_delete,
        role_id: obj.role_id,
        group_id: obj.group_id,
      }))
    })
  }

  get roleArray() {
    return <FormArray>this.formGroupCreate.get('data');
  }

  getSelectedRole() {
    this.selectedRoleId = [];
    this.roleArray.controls.forEach((control, i) => {
      if (control.value) {
        this.selectedRoleId.push(this.roleList[i].id);
      }
    });
  }

  stopPropagation(event){
    event.stopPropagation()
  }

  onCheckAllChange(event, roleList) {
    const formArray = this.roleArray;
    if (event.target.checked) {
      roleList.forEach(obj => {
        let done = false;
        obj.status = true;
        this.roleArray?.controls.forEach((ctrl: any) => {
          if (obj.role_id == ctrl.value.role_id) {
            ctrl.value.is_delete = false;
            done = true;
            return;
          }
        });
        done == false && this.roleArray.push(this.fb.group({
          id: 0,
          is_delete: false,
          role_id: obj.role_id,
          group_id: this.group.id,
        }))
      })
    } else {
      let i: number = 0;
      this.roleArray?.controls.forEach((ctrl: any, index) => {
        roleList.forEach(obj => {
          obj.status = false
          if (ctrl.value.role_id == obj.role_id) {
            if (ctrl.value.id != 0) {
              ctrl.value.is_delete = true
            } else {
              formArray.removeAt(i);
            }
            return;
          }
        })
        i++;
      });
    }
  }

  onCheckChange(event, categoryRole) {
    const formArray = this.roleArray;
    let done = false;
    if (event.target.checked) {
      this.roleArray?.controls.forEach((ctrl: any) => {
        if (ctrl.value.role_id == parseInt(event.target.value)) {
          ctrl.value.is_delete = false;
          done = true;
          return;
        }
      });
      if (done == false) {
        this.roleArray.push(this.fb.group({
          id: 0,
          is_delete: false,
          role_id: parseInt(event.target.value),
          group_id: this.group.id,
        }))
      }

      categoryRole.status = true;
      categoryRole.role.forEach(obj => {
        obj.status == false && (categoryRole.status = false)
      })
    }
    else {
      let i: number = 0;
      categoryRole.status = false;
      this.roleArray?.controls.forEach((ctrl: any, index) => {
        if (ctrl.value.role_id == event.target.value) {
          if (ctrl.value.id != 0) {
            ctrl.value.is_delete = true
          } else {
            formArray.removeAt(i);
          }
          return;
        }
        i++;
      });
    }
  }

  save() {

    this.formSubmitted = true;
    if (this.formGroupCreate.invalid) {
      return;
    }
    // console.log(this.formGroupCreate.value.data)
    if (!(this.groupRoleList.length > 0)) {
      this.userService.adminRoleGroupCreateListUrl(this.formGroupCreate.value.data).subscribe(rs => {
        if (rs.statusCode == 200) {
          this.toast.success(rs.message);
        } else {
          this.toast.warning(rs.message);
        }
        this.close()
      })
    } else {
      this.userService.adminRoleGroupModifyListUrl(this.formGroupCreate.value.data).subscribe(rs => {
        if (rs.statusCode == 200) {
          this.toast.success(rs.message);
        } else {
          this.toast.warning(rs.message);
        }
        this.close()
      })
    }
  }

  close() {
    this.modal.close();
  }

}
