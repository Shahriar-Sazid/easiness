import { Component, Input, OnInit } from '@angular/core';
import { DocumentOptions } from 'src/app/core/models/purchase.model';

@Component({
  selector: 'app-invoice-item-header',
  templateUrl: './invoice-item-header.component.html',
  styleUrls: ['./invoice-item-header.component.scss']
})
export class InvoiceItemHeaderComponent implements OnInit {
  @Input() viewOptions: DocumentOptions;
  constructor() { }

  display(prop: string) {
    return this.viewOptions[prop]?.show
  }

  col(prop: string) {
    return this.viewOptions[prop]?.show?.col
  }
  
  ngOnInit(): void {
  }

}
