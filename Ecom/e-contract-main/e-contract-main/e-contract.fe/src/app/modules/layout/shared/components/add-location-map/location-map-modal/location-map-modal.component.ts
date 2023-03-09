import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LocationService } from 'src/app/modules/layout/service/location.service';
import { AuthService } from 'src/app/modules/auth';
@Component({
  selector: 'location-map-modal',
  templateUrl: './location-map-modal.component.html',
  styleUrls: ['./location-map-modal.component.scss']
})
export class LocationMapModalComponent implements OnInit {

  //@ViewChild('SelectMapModal', { static: false }) modal: ModalDirective;
  @Output() coordinate: EventEmitter<any> = new EventEmitter<any>();
  @Output() itemSubmited: EventEmitter<any> = new EventEmitter<any>();
  active = false;
  saving = false;
  latitude: number = 21.030887;
  longitude: number = 105.836565;
  @Input() selectCoords: any;
  @Input() address: any;
  urlMapPage: any;
  role = localStorage.getItem('role')
  constructor(
    injector: Injector,
    public modal: NgbActiveModal,
    private _locationService: LocationService,
    public sanitizer: DomSanitizer,
    private _auth: AuthService,
  ) {}

  show(lgn?: any, lat?: any): void {
    if (!this.selectCoords || this.selectCoords == null || this.selectCoords == '') {
      this._locationService.SearchLocationByAddres(this.address).subscribe(res => {
        if (res) {
          this._locationService.GetLngLatByPlaceId(res.predictions[0]?.place_id).subscribe(resLng => {
            this.selectCoords = `{"lng":${resLng.result.geometry.location.lng},"lat":${resLng.result.geometry.location.lat}}`;
          })
        }
      })
    }
    //this.modal.show();

  }

  ngOnInit(): void {
    this.show();
    setTimeout(() => {
      this.urlMapPage = this.sanitizer.bypassSecurityTrustResourceUrl('assets/map.html');;
    }, 500);
  }
  onClick(): void {
    this.itemSubmited.emit(JSON.parse(this.selectCoords));
    this.modal.close();
  }

  close(): void {
    this.active = false;
    this.modal.close();
  }
  onMapClicked(event: any) {
    this.selectCoords = event.coords;
    console.table(event.coords);
    this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;
  }
}
