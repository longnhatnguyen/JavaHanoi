import { Component, Input, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { Configuration } from '../../config/configuration';
import { ApiStorageConstant } from '../upload-file/fileupload-item';

@Component({
  selector: 'app-zoom-image',
  templateUrl: './zoom-image.component.html',
  styleUrls: ['./zoom-image.component.scss']
})
export class ZoomImageComponent implements OnInit {

  @Input() fileItems: any;
  @Output("dataReturn") dataReturn = new EventEmitter();
  url = this.config.ApiUrl + ApiStorageConstant.fileImageUrl;

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
  constructor(
    private config: Configuration,
  ) { }

  ngOnChange() {
  }

  ngOnInit(): void {
    console.log("hello world")
  }

  // ngOnDestroy() {
  //   this.dataReturn.emit(false);
  // }

  @HostListener('click', ['$event.target']) onClick(btn) {
    this.dataReturn.emit(false);
  }

}
