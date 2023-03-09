import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryRatioListComponent } from './category-ratio-list.component';

describe('CategoryRatioListComponent', () => {
  let component: CategoryRatioListComponent;
  let fixture: ComponentFixture<CategoryRatioListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryRatioListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryRatioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
