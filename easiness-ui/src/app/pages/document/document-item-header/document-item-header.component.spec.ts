import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentItemHeaderComponent } from './document-item-header.component';

describe('InvoiceItemHeaderComponent', () => {
  let component: DocumentItemHeaderComponent;
  let fixture: ComponentFixture<DocumentItemHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentItemHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentItemHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
