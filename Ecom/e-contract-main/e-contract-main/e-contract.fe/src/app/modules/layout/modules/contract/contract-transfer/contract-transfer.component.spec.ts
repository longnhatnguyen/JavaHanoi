import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractTransferComponent } from './contract-transfer.component';

describe('ContractTransferComponent', () => {
  let component: ContractTransferComponent;
  let fixture: ComponentFixture<ContractTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
