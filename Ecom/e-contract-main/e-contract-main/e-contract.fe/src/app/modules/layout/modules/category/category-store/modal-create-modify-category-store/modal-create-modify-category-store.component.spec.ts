import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateModifyCategoryStoreComponent } from './modal-create-modify-category-store.component';

describe('ModalCreateModifyCategoryStoreComponent', () => {
  let component: ModalCreateModifyCategoryStoreComponent;
  let fixture: ComponentFixture<ModalCreateModifyCategoryStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCreateModifyCategoryStoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCreateModifyCategoryStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
