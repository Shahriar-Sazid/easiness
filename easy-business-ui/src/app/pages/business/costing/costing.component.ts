import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Product } from 'src/app/core/models/product.model';
import { DocumentItem } from 'src/app/core/models/purchase.model';
import { PlaceService } from 'src/app/core/services/place.service';
import { UnitService } from 'src/app/core/services/unit.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-costing',
  templateUrl: './costing.component.html',
  styleUrls: ['./costing.component.scss']
})
export class CostingComponent implements OnInit {
  @Input() defaultPlace: number;
  @ViewChild('costingModal') content: any;
  costingForm: FormGroup;
  selectedProduct: Product;
  @Input('selectedPlace') selectedPlace: any;
  @Output() onAdded: EventEmitter<DocumentItem> = new EventEmitter();
  modalRef: NgbModalRef;

  constructor(private fb: FormBuilder,
    public util: UtilService,
    public placeService: PlaceService,
    public unitService: UnitService,
    private modalService: NgbModal) {
    unitService.fetchUnitData().subscribe();
  }

  ngOnInit(): void {
    console.log('ng on init called');
  }

  openCostingModal(product: Product) {
    this.modalRef = this.modalService
      .open(this.content, { ariaLabelledBy: 'modal-basic-title' });
    this.modalRef.result.then((result) => {
      console.log(`Closed with: ${result}`);
      this.costingForm.reset();
      this.selectedProduct = null;
    }, (reason) => { });
    this.selectedProduct = product;

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
      place: [this.defaultPlace]
    });
  }

  addToPurchaseList() {
    if (this.util.validateForm(this.costingForm)) {
      console.log(this.costingForm.value);
      let invoiceItem: DocumentItem = {
        entity: { ...this.selectedProduct },
      } as DocumentItem;

      for (let [key, value] of Object.entries(this.costingForm.value)) {
        invoiceItem[key] = value;
      }
      this.onAdded.emit(invoiceItem);
      this.modalRef.close();
    }
  }
}
