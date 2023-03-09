import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateModifyCategoryRatioComponent } from './modal-create-modify-category-ratio.component';

describe('ModalCreateModifyCategoryRatioComponent', () => {
  let component: ModalCreateModifyCategoryRatioComponent;
  let fixture: ComponentFixture<ModalCreateModifyCategoryRatioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCreateModifyCategoryRatioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCreateModifyCategoryRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
