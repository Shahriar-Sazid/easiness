import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxDetailComponent } from './tx-detail.component';

describe('TxDetailComponent', () => {
  let component: TxDetailComponent;
  let fixture: ComponentFixture<TxDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TxDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
