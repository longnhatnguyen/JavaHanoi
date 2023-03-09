import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateEditCustomerComponent } from './modal-create-edit-customer.component';

describe('ModalCreateEditCustomerComponent', () => {
  let component: ModalCreateEditCustomerComponent;
  let fixture: ComponentFixture<ModalCreateEditCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCreateEditCustomerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCreateEditCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
