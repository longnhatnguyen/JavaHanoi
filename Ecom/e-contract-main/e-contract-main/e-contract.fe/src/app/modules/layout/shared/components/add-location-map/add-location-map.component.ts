import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
// import { AppComponentBase } from 'app/shared/common/app-base-component';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/modules/auth';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationMapModalComponent } from './location-map-modal/location-map-modal.component';

@Component({
  selector: 'add-location-map',
  templateUrl: './add-location-map.component.html',
  styleUrls: ['./add-location-map.component.scss']
})
export class AddLocationMapComponent implements OnInit {

  @Output() coordinate: EventEmitter<any> = new EventEmitter<any>();
  @Input() location: any;
  @Input() locationShow: any;
  @Input() address: any;

  active = false;
  saving = false;
  latitude: any;
  longitude: any;
  selectCoords: any;
  role = localStorage.getItem('role')
  constructor(
    injector: Injector,
    private _auth: AuthService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }

  openShowMapModal() {
    const dialogRef = this.modalService.open(LocationMapModalComponent,
      {
        size: 'lg',
      });
    dialogRef.componentInstance.address = this.address || null;
    dialogRef.componentInstance.itemSubmited.subscribe(res => {
      if (res) {
        this.latitude = res['lat'] + '';
        this.longitude = res['lng'] + '';
        this.locationShow = '(' + res['lng'] + " , " + res['lat'] + ')';
        this.coordinate.emit(res);
      }
    });
  }

  getCoordinate($event): void {
    if ($event) {
      this.coordinate.emit($event);
      this.latitude = $event['lat'] + '';
      this.longitude = $event['lng'] + '';
      this.locationShow = '(' + $event['lng'] + " , " + $event['lat'] + ')';
    }
  }
}
