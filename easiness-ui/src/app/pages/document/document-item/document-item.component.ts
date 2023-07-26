import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Place } from 'src/app/core/models/place.model';
import { DocumentItem, DocumentOptions, DocumentType } from 'src/app/core/models/document.model';
import { calcQuantityUnitError } from 'src/app/core/validation/custom-validation';
import { UtilService } from 'src/app/core/services/util.service';
import { UnitService } from 'src/app/core/services/iface/unit.service';

@Component({
  selector: 'app-document-item',
  templateUrl: './document-item.component.html',
  styleUrls: ['./document-item.component.scss']
})
export class DocumentItemComponent {
  document = document;
  @Input() viewOptions: DocumentOptions;
  @ViewChild('fr') itemForm!: NgForm;
  @ViewChild('placeInput') placeInput!: ElementRef;
  @ViewChild('costInput') costInput!: ElementRef;
  @ViewChild('priceInput') priceInput!: ElementRef;
  @Input() editPermission: boolean;
  editMode = false;
  @Input() placeRecord: Record<string, Place>;
  @Input() item: DocumentItem;
  @Input() index: number;
  @Output() cancel: EventEmitter<number> = new EventEmitter();
  @Output() nextCursor: EventEmitter<number> = new EventEmitter();

  constructor(public unitService: UnitService, private util: UtilService) {
  }

  display(prop: string) {
    return this.viewOptions[prop]?.show
  }

  col(prop: string) {
    return this.viewOptions[prop]?.show?.col
  }

  delayedFocus(inp: HTMLInputElement) {
    if (this.editPermission) {
      setTimeout(() => { // this will make the execution after the above boolean has changed
        inp.focus();
      }, 100);
    }
  }

  getProductDetails() {
    return this.util.filterAndJoin([
      this.item.entity.name,
      this.item.entity.type,
      this.item.entity.brand,
      this.item.entity.country,
      this.item.entity.size,
    ])
  }

  cancelItem() {
    this.cancel.emit(this.index);
  }

  focusNextItem() {
    this.nextCursor.emit(this.index);
  }

  focusCurrentItem() {
    switch (this.viewOptions.key) {
      case DocumentType.INITIAL_STOCK:
        this.placeInput.nativeElement.focus()
        break;
      case DocumentType.PURCHASE_ORDER:
        this.editMode = true
        this.delayedFocus(this.costInput.nativeElement)
        break;
      case DocumentType.INVOICE:
        this.editMode = true
        this.delayedFocus(this.priceInput.nativeElement)
        break;
    }
  }

  isValid() {
    return this.itemForm.valid;
  }

  validateQuantity(quantity: string | number) {
    if (this.viewOptions.validateQty) {
      const errors = calcQuantityUnitError(
        this.item.unit, this.item.entity.unit,
        quantity, this.item.entity.quantity,
        this.unitService);
      this.itemForm.controls['quantity'].setErrors(errors?.invalidQty ? { invalidQty: errors?.invalidQty } : null);
      this.itemForm.controls['unit'].setErrors(errors?.invalidUnit ? { invalidUnit: errors?.invalidUnit } : null);
    }
  }

  validateUnit(unit: string | number) {
    if (this.viewOptions.validateUnit) {
      const errors = calcQuantityUnitError(
        unit, this.item.entity.unit,
        this.item.quantity, this.item.entity.quantity,
        this.unitService);
      this.itemForm.controls['quantity'].setErrors(errors?.invalidQty ? { invalidQty: errors?.invalidQty } : null);
      this.itemForm.controls['unit'].setErrors(errors?.invalidUnit ? { invalidUnit: errors?.invalidUnit } : null);
    }
  }
}