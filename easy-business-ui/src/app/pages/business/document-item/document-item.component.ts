import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Place } from 'src/app/core/models/place.model';
import { DocumentItem, DocumentOptions } from 'src/app/core/models/purchase.model';
import { UnitService } from 'src/app/core/services/unit.service';
import { calcQuantityUnitError } from 'src/app/core/validation/custom-validation';

@Component({
  selector: 'app-document-item',
  templateUrl: './document-item.component.html',
  styleUrls: ['./document-item.component.scss']
})
export class InvoiceItemComponent implements OnInit {
  document = document;
  @Input() viewOptions: DocumentOptions;
  @ViewChild('fr') itemForm!: NgForm;
  editCost = false;
  @Input() placeRecord: Record<string, Place>;
  @Input() item: DocumentItem;
  @Input() index: number;
  @Output() onCancel: EventEmitter<number> = new EventEmitter();
  constructor(public unitService: UnitService) {
  }

  ngOnInit(): void { }

  display(prop: string) {
    return this.viewOptions[prop]?.show
  }

  col(prop: string) {
    return this.viewOptions[prop]?.show?.col
  }

  delayedFocus(inp: HTMLInputElement) {
    setTimeout(() => { // this will make the execution after the above boolean has changed
      inp.focus();
    }, 0);
  }

  getJoinedText() {
    let arr = [
      this.item.entity.name,
      this.item.entity.type,
      this.item.entity.brand,
      this.item.entity.country,
      this.item.entity.size,
    ].filter(el => el);
    return arr.join(", ");
  }

  cancel() {
    this.onCancel.emit(this.index);
  }

  isValid() {
    return this.itemForm.valid;
  }

  validateQuantity(quantity: string | number) {
    if (this.viewOptions.validateQty) {
      let errors = calcQuantityUnitError(
        this.item.unit, this.item.entity.unit,
        quantity, this.item.entity.quantity,
        this.unitService);
      this.itemForm.controls['quantity'].setErrors(errors?.invalidQty ? { invalidQty: errors?.invalidQty } : null);
      this.itemForm.controls['unit'].setErrors(errors?.invalidUnit ? { invalidUnit: errors?.invalidUnit } : null);
    }
  }

  validateUnit(unit: string | number) {
    if (this.viewOptions.validateUnit) {
      let errors = calcQuantityUnitError(
        unit, this.item.entity.unit,
        this.item.quantity, this.item.entity.quantity,
        this.unitService);
      this.itemForm.controls['quantity'].setErrors(errors?.invalidQty ? { invalidQty: errors?.invalidQty } : null);
      this.itemForm.controls['unit'].setErrors(errors?.invalidUnit ? { invalidUnit: errors?.invalidUnit } : null);
    }
  }
}