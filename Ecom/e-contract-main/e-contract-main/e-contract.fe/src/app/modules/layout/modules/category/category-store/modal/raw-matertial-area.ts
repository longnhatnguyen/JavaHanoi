import { FileImage } from "src/app/modules/layout/shared/components/upload-file/fileupload-item";

export class RawMaterialArea {
  id: number;
  userAdded: number;
  userUpdated: number;
  shop_id: number;
  code: string;
  name: string;
  address: string;
  acreage: string;
  quantity: any;
  is_active: boolean;
  map: string;
  is_delete: boolean;
  files: FileImage[];
}
