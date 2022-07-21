import { Component, Input, OnInit } from '@angular/core';
import { Document, DocumentOptions, DocumentType } from 'src/app/core/models/document.model';

@Component({
  selector: 'app-document-item-footer',
  templateUrl: './document-item-footer.component.html',
  styleUrls: ['./document-item-footer.component.scss']
})
export class DocumentItemFooterComponent implements OnInit {
  @Input() document: Document;
  @Input() viewOptions: DocumentOptions;
  constructor() { }

  ngOnInit(): void {
  }

  isInvoice(): boolean {
    return this.document.type === DocumentType.INVOICE
  }

  calculateToatalCost(): number {
    return this.document.items?.reduce((prev, cur) => {
      return prev + cur?.cost * cur?.quantity;
    }, 0);
  }

  calculateToatalPrice(): number {
    return this.document.items?.reduce((prev, cur) => {
      return prev + cur?.price * cur?.quantity;
    }, 0);
  }
}
