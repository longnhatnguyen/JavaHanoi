import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProofOfEcontractComponent } from './proof-of-econtract.component';

describe('ProofOfEcontractComponent', () => {
  let component: ProofOfEcontractComponent;
  let fixture: ComponentFixture<ProofOfEcontractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProofOfEcontractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProofOfEcontractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
