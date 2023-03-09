import { HttpErrorResponse } from '@angular/common/http';
import {
  Component, EventEmitter, Injector, Input, OnInit, Output,
  // Directive, ElementRef, Renderer, OnChanges, SimpleChanges
} from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiStorageConstant, FileImage, FileParam, FileUploadItem } from './fileupload-item';
import { Guid } from './fileupload-item';
import { ConfirmDialogService } from '../../../service/confirm-dialog.service';
import { UploadFileService } from '../../../service/upload-file.service';
import { Configuration } from '../../config/configuration';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.less']
})
export class UploadFileComponent implements OnInit {
  @Input() buttonText: string;
  @Input() fileTitle: string;
  @Input() type: any;
  @Input() maxlength: number = 1;
  @Input() showThumbnail: boolean = true;
  @Input() fileInput: FileImage[];
  url: string;
  fileItems: FileUploadItem[] = [];
  fileItemsDeleted: FileUploadItem[] = [];
  fileItemUpdateLoad: FileImage[] = [];
  fileItemsUpdate: FileImage[] = [];
  fileNumber: number[];
  selectIndexFile = 0;
  constructor(
    injector: Injector,
    //private el: ElementRef, private renderer: Renderer
    //private _fileInfoApiServiceProxy: FileInfoApiServiceProxy,
    private _uploadFileService: UploadFileService,
    private confirmDialog: ConfirmDialogService,
    private config: Configuration,
    private toastr: ToastrService
  ) {

  }


  ngOnInit() {
    this.initImageList();
  }

  initImageList(): void {
    this.fileNumber = Array(this.maxlength).fill(Number).map((x, i) => i);
    this.fileItems = [];
    for (let i = 0; i < this.maxlength; i++) {
      let item = new FileUploadItem();
      item.id = i;
      this.fileItems.push(item);
    }
  }

  checkOnlyImage(filename) {
    var ext = this.getExtension(filename)
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'svg':
      case 'pdf':
        return true
    }
    return false
  }

  onLoadImage(fileLoads: FileImage[], edit?: boolean): void {
    this.fileItemUpdateLoad = fileLoads;
    edit = true;
    this.initImageList();
    if (fileLoads && fileLoads.length > 0) {
      fileLoads.forEach((img, index) => {
        let url = this.config.ApiUrl + ApiStorageConstant.fileImageUrl;
        let temptfile = new FileUploadItem();
        temptfile.id = img.id;
        temptfile.url = url + img.path;
        temptfile.fileName = img.name;

        temptfile.idtable = img.idtable;
        temptfile.tablename = img.tablename;
        temptfile.name_guid = img.name_guid;

        temptfile.ipserver = img.name_guid;
        temptfile.type = img.type;
        temptfile.path = img.path;
        temptfile.fileType = img.file_type;

        temptfile.isAdd = false;

        if (this.checkOnlyImage(img.file_type)) {
          temptfile.format = 'image';
        }
        else {
          temptfile.format = 'video';
          temptfile.urlVideo = url + img.path;
        }

        if (edit) {
          fetch(url + img.path)
            .then((e) => {
              return e.blob()
            })
            .then((blob) => {
              let b: any = blob
              b.lastModifiedDate = new Date()
              b.name = ''
              temptfile.content = b as File
              temptfile.hasContent = true
              this.fileItems[index] = temptfile;
            });
        }
        else {
          this.fileItems[index] = temptfile;
        }
      });
    }
  }

  onUploadFile(isUpdate?: boolean): Observable<any> {
    let response: any;
    var formData: any = new FormData();

    if (isUpdate) // Update
    {
      // Lấy danh sách Deleted
      for (const element of this.fileItemsDeleted) {
        let deletedItem = new FileImage();
        deletedItem.id = element.id;
        deletedItem.is_delete = true;

        deletedItem.name = element.fileName;
        deletedItem.name_guid = element.name_guid;
        deletedItem.type = element.type;
        deletedItem.path = element.path;
        deletedItem.file_type = element.fileType;

        deletedItem.idtable = element.idtable;
        deletedItem.tablename = element.tablename;
        deletedItem.ipserver = element.name_guid;

        this.fileItemsUpdate.push(deletedItem);
      }

      //
      for (const item of this.fileItems) {
        if (item.content && item.fileName != '' && item.isAdd) {
          formData.append("data", item.content, item.fileName);
        }
        else if (!item.isDeleted && item.fileName != '' && item.hasContent) {
          let updateItem = new FileImage();
          updateItem.id = item.id;
          updateItem.is_delete = false;

          updateItem.name = item.fileName;
          updateItem.idtable = item.idtable;
          updateItem.tablename = item.tablename;
          updateItem.name_guid = item.name_guid;

          updateItem.ipserver = item.name_guid;
          updateItem.type = item.type;
          updateItem.path = item.path;
          updateItem.file_type = item.fileType;
          this.fileItemsUpdate.push(updateItem);
        }
      }

      if (formData && formData.get('data')) {
        return this._uploadFileService.uploadImage(formData).pipe(
          map(async (res: any) => {
            let newFile = res['newFiles'];
            if (newFile)
              this.fileItemsUpdate.unshift(...newFile);
            return this.fileItemsUpdate;
          }),
          catchError((error: HttpErrorResponse) => {
            return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
          }),
        )
      }
      else {
        return of(this.fileItemsUpdate);
      }

    }
    else { // Add
      this.fileItems.forEach(async item => {
        if (item.content && item.fileName != '') {
          formData.append("data", item.content, item.fileName);
        }
      });
      if (formData && formData.get('data')) {
        return this._uploadFileService.uploadImage(formData).pipe(
          map((res: any) => {
            return res['newFiles'];
          }),
          catchError((error: HttpErrorResponse) => {
            return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
          }),
        )
      }
    }

    return null;
  }

  onDeleted(id: any): void {
    {
      this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn xóa file này ?')
        .then((confirmed) => {
          if (confirmed) {
            this.fileItems[id].isDeleted = true;
            this.fileItems[id].content = null;
            this.fileItems[id].url = '';
            this.fileItems[id].fileName = '';
            this.fileItems[id].hasContent = false;
            if (!this.fileItems[id].isAdd)
              this.fileItemsDeleted.push(this.fileItems[id]);
          }
        }
        )
        .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));

    }
    // if (confirm("Có chắc chắn muốn xóa file này?")) {
    //     // var element = document.getElementById(id);
    //     // element.parentNode.removeChild(element);
    //     //var index = this.fileItems.findIndex((e) => e.id == id)

    // }
  }

  onSelectFile($event) {
    this.onSelectFileNoResize($event);
  }

  onSelectFileNoResize($event) {
    let files: FileList = $event.target.files;
    if (files != null) {
      //let temps = []
      for (let i = 0; i < files.length; i++) {
        let isImage = this.checkFileIsImage(files[i].name);
        const extension = files[i].name.split('.').pop().toLowerCase();
        if (isImage) {

          var reader = new FileReader();
          reader.readAsDataURL($event.target.files[i]); // read file as data url
          reader.onload = ($event) => { // called once readAsDataURL is completed
            let fr = $event.target as FileReader;
            let src = fr.result as string;
            let fileAdd = new FileUploadItem();
            fileAdd.id = 0;
            fileAdd.isAdd = true;
            fileAdd.content = files[i];
            fileAdd.url = src;
            fileAdd.fileName = Guid.newGuid() + '.' + extension;
            fileAdd.fileType = extension;
            fileAdd.hasContent = true;

            if (files[i].type.indexOf('image') > -1) {
              fileAdd.format = 'image';
            } else if (files[i].type.indexOf('video') > -1) {
              fileAdd.format = 'video';
              fileAdd.urlVideo = (<FileReader>$event.target).result;
            }
            this.fileItems[this.selectIndexFile] = fileAdd;
          }

        } else {
          this.toastr.warning('File không đúng định dạng quy định, vui lòng chọn lại các file có định dạng: .jpg; .jpeg; .png; .svg; .pdf; .mp4; ');
          //this.toastr.error(this.l('IncorrectImageFormat'), '', { timeOut: 5000, extendedTimeOut: 1000, positionClass: 'toast-bottom-left' })
          break;
        }
      }
    }
  }

  getExtension(filename) {
    var parts = filename.split('.')
    return parts[parts.length - 1]
  }
  checkFileIsImage(filename) {
    var ext = this.getExtension(filename)
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'svg':
      case 'pdf':
      case 'mp4':
      case 'svg':
        return true
    }
    return false
  }
  generateMaxId(list: any[]): number {
    let values = []
    if (list.length == 0) {
      return 1
    } else if (list.length == 1) {
      return +list[0].id + 1
    } else {
      values = list.map((item) => {
        return item.id
      })

      let max = Math.max(...values)
      return max + 1
    }
  }

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];
  displayCustom: boolean;
  activeIndex: number = 0;
  imageClick(index: number) {
    this.activeIndex = index;
    this.displayCustom = true;
  }

  browseFile(id: any): void {
    this.selectIndexFile = id;
  }

  closeImage() {
    if (this.fileItems.length <= 1) {
      this.displayCustom = false;
    }
  }
}

