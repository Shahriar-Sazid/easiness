import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceItemFooterComponent } from './document-item-footer.component';

describe('InvoiceItemFooterComponent', () => {
  let component: InvoiceItemFooterComponent;
  let fixture: ComponentFixture<InvoiceItemFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceItemFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceItemFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
