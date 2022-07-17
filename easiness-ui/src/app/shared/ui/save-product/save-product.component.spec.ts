import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveProductComponent } from './save-product.component';

describe('AddProductComponent', () => {
  let component: SaveProductComponent;
  let fixture: ComponentFixture<SaveProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
