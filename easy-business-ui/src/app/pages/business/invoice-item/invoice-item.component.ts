import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Place } from 'src/app/core/models/place.model';
import { InvoiceItem } from 'src/app/core/models/purchase.model';
import { UnitService } from 'src/app/core/services/unit.service';

@Component({
  selector: 'app-invoice-item',
  templateUrl: './invoice-item.component.html',
  styleUrls: ['./invoice-item.component.scss']
})
export class InvoiceItemComponent implements OnInit {
  @ViewChild('fr') invoiceForm!: NgForm;
  editCost = false;
  @Input() placeRecord: Record<string, Place>;
  @Input() item: InvoiceItem;
  @Input() index: number;
  @Output() onCancel: EventEmitter<number> = new EventEmitter();
  constructor(public unitService: UnitService) {
  }

  ngOnInit(): void {
  }

  delayedFocus(inp: HTMLInputElement) {
    setTimeout(() => { // this will make the execution after the above boolean has changed
      inp.focus();
    }, 0);
  }

  getJoinedText() {
    let arr =  [
      this.item.product.name,
      this.item.product.type,
      this.item.product.brand,
      this.item.product.country,
      this.item.product.size
    ].filter(el => el);
    return arr.join(", ");
  }

  cancel() {
    this.onCancel.emit(this.index);
  }

  isValid() {
    return this.invoiceForm.valid;
  }

}
