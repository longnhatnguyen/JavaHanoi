import { SafeResourceUrl } from "@angular/platform-browser";
// import jsonURL from 'src/assets/app-config.json';

export class FileUploadItem {
  public id: number;
  public fileName: string = '';
  public fileType: string = '';
  public url: string = '';
  public urlVideo: any;
  public content: File;
  public idtable: number;
  public tablename: string;
  public name_guid: string;
  public ipserver: string;
  public type: number;
  public path: string;
  public isAdd: boolean = true;
  public isDeleted: boolean = false;
  public hasContent: boolean = false;
  public format: any;
}
export class FileParam {
  data: any;
  fileName: string;
}

export class FileImage {
  id: number;
  idtable: number;
  tablename: string;
  name_guid: string;
  name: string;
  ipserver: string;
  type: number;
  path: string;
  file_type: string;
  is_delete: boolean;
}

export class Guid {
  static newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

// const jsonconfig = jsonURL;
export class ApiStorageConstant {

  // File
  public static UploadImg = "file/upload";
  public static fileImageUrl = "file/view-img?url_file=";
  public static filePDFUrl = "file/view-pdf?url_file=";
  public static UploadFileDocument = "";
}
