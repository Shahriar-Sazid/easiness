import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentItemFooterComponent } from './document-item-footer.component';

describe('InvoiceItemFooterComponent', () => {
  let component: DocumentItemFooterComponent;
  let fixture: ComponentFixture<DocumentItemFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentItemFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentItemFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
