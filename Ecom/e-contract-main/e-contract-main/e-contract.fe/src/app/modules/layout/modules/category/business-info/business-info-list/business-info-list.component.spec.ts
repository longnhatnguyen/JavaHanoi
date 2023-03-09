import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessInfoListComponent } from './business-info-list.component';

describe('BusinessInfoListComponent', () => {
  let component: BusinessInfoListComponent;
  let fixture: ComponentFixture<BusinessInfoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessInfoListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessInfoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
