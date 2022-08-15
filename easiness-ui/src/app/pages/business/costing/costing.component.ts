import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DocumentItem } from 'src/app/core/models/document.model';
import { Product } from 'src/app/core/models/product.model';
import { Stock } from 'src/app/core/models/stock.model';
import { PlaceService } from 'src/app/core/services/place.service';
import { UnitService } from 'src/app/core/services/unit.service';
import { UtilService } from 'src/app/core/services/util.service';
import { ValidateSaleQuantityUnit } from 'src/app/core/validation/custom-validation';

@Component({
  selector: 'app-costing',
  templateUrl: './costing.component.html',
  styleUrls: ['./costing.component.scss']
})
export class CostingComponent implements OnInit {
  @Input() mode: 'buy' | 'sell';
  @Input() defaultPlace: number;
  @ViewChild('costingModal') content: any;
  costingForm: UntypedFormGroup;
  selectedEntity: Product & Stock;
  @Input() selectedPlace: any;
  @Output() add: EventEmitter<DocumentItem> = new EventEmitter();
  modalRef: NgbModalRef;

  constructor(private fb: UntypedFormBuilder,
    public util: UtilService,
    public placeService: PlaceService,
    public unitService: UnitService,
    private modalService: NgbModal) {
    unitService.fetchUnitData().subscribe();
  }

  ngOnInit(): void {
    console.log('ng on init called');
  }

  getProductDetails(): string {
    return this.util.filterAndJoin((
      (entity: Stock) =>
        [entity.name, entity.type, entity.brand, entity.country, entity.size, entity.placeTxt])(this.selectedEntity))
  }

  openCostingModal(entity: Product & Stock) {
    this.modalRef = this.modalService
      .open(this.content, { ariaLabelledBy: 'modal-basic-title' });
    this.modalRef.result.then((result) => {
      console.log(`Closed with: ${result}`);
      this.costingForm.reset();
      // this.selectedEntity = null;
    }, (reason) => {
      console.log(reason);
    });
    this.selectedEntity = entity;
    console.log(this.selectedEntity);


    if (this.mode == 'buy') {
      this.costingForm = this.fb.group({
        cost: [
          undefined,
          [
            Validators.min(-100000000),
            Validators.max(100000000),
          ],
        ],
        quantity: [
          undefined,
          [
            Validators.min(-100000000),
            Validators.max(100000000),
          ],
        ],
        unit: [undefined],
        place: [this.defaultPlace],

      });
    } else {
      this.costingForm = this.fb.group({
        price: [
          undefined,
          [
            Validators.min(-100000000),
            Validators.max(100000000),
          ],
        ],
        quantity: [
          undefined,
          [
            Validators.min(-100000000),
            Validators.max(100000000),
          ],
        ],
        unit: [this.selectedEntity.unit],
      }, { validators: ValidateSaleQuantityUnit(this.selectedEntity.quantity, this.selectedEntity.unit, this.unitService) });
    }


  }

  addToPurchaseList() {
    if (this.util.validateForm(this.costingForm)) {
      console.log(this.costingForm.value);
      const purchaseOrderItem: DocumentItem = {
        entity: { ...this.selectedEntity },
      } as DocumentItem;

      ['cost', 'quantity', 'unit', 'place'].forEach(el => {
        purchaseOrderItem[el] = this.costingForm.value[el]
      })

      this.add.emit(purchaseOrderItem);
      this.modalRef.close();
    }
  }
  addToSalesList() {
    if (this.util.validateForm(this.costingForm)) {
      console.log(this.costingForm.value);
      const documentItem: DocumentItem = {
        entity: { ...this.selectedEntity },
      } as DocumentItem;

      ['price', 'quantity', 'unit'].forEach(el => {
        documentItem[el] = this.costingForm.value[el]
      })

      this.add.emit(documentItem);
      this.modalRef.close();
    }
  }

  getProfitPercentage(): number {
    if (this.costingForm.value.price > 0) {
      return (((this.costingForm.value.price - this.selectedEntity.cost) / this.selectedEntity.cost) * 100)
    }
    return undefined;
  }
}
