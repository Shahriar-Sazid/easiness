import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Place } from 'src/app/core/models/place.model';
import { InvoiceItem } from 'src/app/core/models/purchase.model';
import { UnitService } from 'src/app/core/services/unit.service';

@Component({
  selector: 'app-invoice-item',
  templateUrl: './invoice-item.component.html',
  styleUrls: ['./invoice-item.component.scss']
})
export class InvoiceItemComponent implements OnInit {
  editCost = false;
  editQuantity = false;
  @Input() placeRecord: Record<string, Place>;
  @Input() item: InvoiceItem;
  constructor(public unitService: UnitService) {
  }

  ngOnInit(): void {
  }

  abc(inp: HTMLInputElement) {
    setTimeout(()=>{ // this will make the execution after the above boolean has changed
      inp.focus();
    },0);
  }
}
