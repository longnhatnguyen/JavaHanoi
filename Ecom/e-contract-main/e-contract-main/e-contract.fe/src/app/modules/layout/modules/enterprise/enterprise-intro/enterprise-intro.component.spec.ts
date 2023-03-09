import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseIntroComponent } from './enterprise-intro.component';

describe('EnterpriseIntroComponent', () => {
  let component: EnterpriseIntroComponent;
  let fixture: ComponentFixture<EnterpriseIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterpriseIntroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterpriseIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
