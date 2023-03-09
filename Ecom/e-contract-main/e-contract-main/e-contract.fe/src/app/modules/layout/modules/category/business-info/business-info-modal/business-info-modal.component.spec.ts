import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessInfoModalComponent } from './business-info-modal.component';

describe('BusinessInfoModalComponent', () => {
  let component: BusinessInfoModalComponent;
  let fixture: ComponentFixture<BusinessInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessInfoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
