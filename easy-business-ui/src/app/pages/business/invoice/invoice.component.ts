import { Component, Input, OnInit } from '@angular/core';
import { Purchase } from 'src/app/core/models/purchase.model';
import { PlaceService } from 'src/app/core/services/place.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  @Input() purchase: Purchase;
  constructor(public placeService: PlaceService) { }

  ngOnInit(): void {
  }

  cancelItem(index: number) {
    this.purchase.items.splice(index, 1);
  }
}
