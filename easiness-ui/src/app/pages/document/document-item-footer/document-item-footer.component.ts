import { Component, Input, OnInit } from '@angular/core';
import { Document, DocumentOptions, DocumentType } from 'src/app/core/models/document.model';

@Component({
  selector: 'app-document-item-footer',
  templateUrl: './document-item-footer.component.html',
  styleUrls: ['./document-item-footer.component.scss']
})
export class DocumentItemFooterComponent {
  @Input() document: Document
  @Input() editPermission: boolean
  @Input() viewOptions: DocumentOptions
  constructor() { }


  calculateTotal(): number {
    if (this.document.type === DocumentType.INVOICE) {
      const total = this.document.items?.reduce((prev, cur) => {
        return prev + cur?.price * cur?.quantity;
      }, 0) ?? 0;
      return total
    } else {
      const total = this.document.items?.reduce((prev, cur) => {
        return prev + cur?.cost * cur?.quantity;
      }, 0) ?? 0;
      return total
    }
  }

  calculateDueOrDebt(): number {
    if (this.document.type === DocumentType.INVOICE) {
      const receivableAmount = this.calculateTotal()
      const receivedAmount = this.document.payments?.reduce((prev, cur) => {
        return prev + Math.abs(+cur.amount)
      }, 0) ?? 0

      return receivableAmount - receivedAmount
    } else if (this.document.type === DocumentType.PURCHASE_ORDER) {
      const payableAmount = this.calculateTotal()
      const paidAmount = this.document.payments?.reduce((prev, cur) => {
        return prev + Math.abs(+cur.amount)
      }, 0) ?? 0

      return payableAmount - paidAmount
    }

  }

}
