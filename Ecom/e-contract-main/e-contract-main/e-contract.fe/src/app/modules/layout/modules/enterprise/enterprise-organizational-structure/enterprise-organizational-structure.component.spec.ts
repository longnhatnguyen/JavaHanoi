import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseOrganizationalStructureComponent } from './enterprise-organizational-structure.component';

describe('EnterpriseOrganizationalStructureComponent', () => {
  let component: EnterpriseOrganizationalStructureComponent;
  let fixture: ComponentFixture<EnterpriseOrganizationalStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterpriseOrganizationalStructureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterpriseOrganizationalStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
