import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../service/user.service';
import { ConfirmDialogService } from '../../../service/confirm-dialog.service';
import { ModalCreateEditGroupUserComponent } from '../modal-create-edit-group-user/modal-create-edit-group-user.component';
import { ModalCreateEditRoleGroupComponent } from '../modal-create-edit-role-group/modal-create-edit-role-group.component';
import { ModalCreateEditGroupComponent } from './modal-create-edit-group/modal-create-edit-group.component';
import { ModalCreateModifyGroupRoleComponent } from '../modal-create-modify-group-role/modal-create-modify-group-role.component';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  stt: number = 0;
  groupList: Array<any>;
  constructor(
    private userService: UserService,
    private modalService: NgbModal,
    private confirmDialog: ConfirmDialogService,
  ) { }

  ngOnInit(): void {
    this.getListGroup()
  }

  getListGroup(): void {
    this.userService.adminGroupListUrl().subscribe(rs => {
      this.groupList = rs.data;
    })
  }

  openCreateEditGroupModal(item: any, index: any) {
    const dialogRef = this.modalService.open(ModalCreateEditGroupComponent,
      {
        size: 'lg',
      });
    dialogRef.componentInstance.group = this.groupList;
    dialogRef.componentInstance.itemDetail = item || null;
    dialogRef.componentInstance.itemSubmited.subscribe((res: any) => {
      if (res) {
        this.getListGroup();
      }
    });
  }

  openCreateModifyUserGroupModal(item: any, index: any) {
    const dialogRef = this.modalService.open(ModalCreateEditGroupUserComponent,
      {
        size: 'lg',
      });
    dialogRef.componentInstance.group = item || null;
    dialogRef.componentInstance.title = 'Chỉnh sửa người dùng' || null;
    dialogRef.componentInstance.itemSubmited.subscribe((res: any) => {
      if (res) {
        this.getListGroup();
      }
    });
  }

  openCreateModifyRoleGroupModal(item: any, index: any) {
    const dialogRef = this.modalService.open(ModalCreateModifyGroupRoleComponent,
      {
        size: 'lg',
      });
    dialogRef.componentInstance.group = item || null;
    dialogRef.componentInstance.title = 'Chỉnh sửa phân quyền' || null;
    dialogRef.componentInstance.itemSubmited.subscribe((res: any) => {
      if (res) {
        this.getListGroup();
      }
    });
  }

  deleteGroup(group: any) {
    this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn xóa bản ghi này ?')
      .then((confirmed) => {
        if (confirmed) {
          this.userService.adminGroupDeleteUrl(group.id).subscribe(rs => {
            this.getListGroup();
          })
        }
      }
      )
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
}
