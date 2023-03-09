import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailCategoryStoreComponent } from './view-detail-category-store.component';

describe('ViewDetailCategoryStoreComponent', () => {
  let component: ViewDetailCategoryStoreComponent;
  let fixture: ComponentFixture<ViewDetailCategoryStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDetailCategoryStoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDetailCategoryStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
