import { Component, Input, OnInit } from '@angular/core';
import { Document } from 'src/app/core/models/purchase.model';

@Component({
  selector: 'app-invoice-item-footer',
  templateUrl: './invoice-item-footer.component.html',
  styleUrls: ['./invoice-item-footer.component.scss']
})
export class InvoiceItemFooterComponent implements OnInit {
  @Input() purchase: Document;
  constructor() { }

  ngOnInit(): void {
  }

  calculateToatalCost(): number {
    return this.purchase.items?.reduce((prev, cur) => {
      return prev + cur?.cost * cur?.quantity;
    }, 0);
  }

}
