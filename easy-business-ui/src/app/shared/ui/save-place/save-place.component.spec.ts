import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavePlaceComponent } from './save-place.component';

describe('SavePlaceComponent', () => {
  let component: SavePlaceComponent;
  let fixture: ComponentFixture<SavePlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavePlaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavePlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
