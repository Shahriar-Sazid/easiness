import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { smoothExpandCollapse } from 'src/app/core/animations/animations';
import { Document } from 'src/app/core/models/purchase.model';
import { PlaceService } from 'src/app/core/services/place.service';
import { InvoiceItemComponent } from '../invoice-item/invoice-item.component';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  animations: [
    smoothExpandCollapse(0, 0, 100)
  ]
})
export class InvoiceComponent implements OnInit {
  @ViewChildren(InvoiceItemComponent) invCompList: QueryList<InvoiceItemComponent>;
  @Input() purchase: Document;
  constructor(public placeService: PlaceService) { }

  ngOnInit(): void {
  }

  cancelItem(index: number) {
    this.purchase.items.splice(index, 1);
  }

  isValid() {
    let valid = true;
    this.invCompList?.forEach(item => {
      valid &&= item.isValid();
    })
    return valid;
  }
}
