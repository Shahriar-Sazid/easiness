import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceItemHeaderComponent } from './invoice-item-header.component';

describe('InvoiceItemHeaderComponent', () => {
  let component: InvoiceItemHeaderComponent;
  let fixture: ComponentFixture<InvoiceItemHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceItemHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceItemHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
