import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveTxComponent } from './save-tx.component';

describe('SaveTxComponent', () => {
  let component: SaveTxComponent;
  let fixture: ComponentFixture<SaveTxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveTxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveTxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
