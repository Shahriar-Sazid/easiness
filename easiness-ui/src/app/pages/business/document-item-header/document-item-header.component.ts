import { Component, Input, OnInit } from '@angular/core';
import { DocumentOptions } from 'src/app/core/models/document.model';

@Component({
  selector: 'app-document-item-header',
  templateUrl: './document-item-header.component.html',
  styleUrls: ['./document-item-header.component.scss']
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
