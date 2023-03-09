import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateEditTransferComponent } from './modal-create-edit-transfer.component';

describe('ModalCreateEditTransferComponent', () => {
  let component: ModalCreateEditTransferComponent;
  let fixture: ComponentFixture<ModalCreateEditTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCreateEditTransferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCreateEditTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
