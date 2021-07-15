import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Place } from 'src/app/core/models/place.model';
import { Product } from 'src/app/core/models/product.model';
import { PlaceService } from 'src/app/core/services/place.service';
import { UnitService } from 'src/app/core/services/unit.service';
import { UtilService } from 'src/app/core/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-costing',
  templateUrl: './costing.component.html',
  styleUrls: ['./costing.component.scss']
})
export class CostingComponent implements OnInit {
  @Input() defaultPlace: number;
  @ViewChild('costingModal') content: any;
  modalRef: NgbModalRef;
  updateMode: boolean;
  costingForm: FormGroup;
  selectedProduct: Product;
  @Input('callback') callback: Function;
  @Input('selectedPlace') selectedPlace: any;
  constructor(private fb: FormBuilder,
    public util: UtilService,
    public placeService: PlaceService,
    public unitService: UnitService,
    private modalService: NgbModal) { }

  ngOnInit(): void { }
  openCostingModal(product: Product) {
    this.modalService
    .open(this.content, {ariaLabelledBy: 'modal-basic-title'})
    .result.then((result) => {
      console.log(`Closed with: ${result}`);
      this.costingForm.reset();
      this.selectedProduct = null;
    }, (reason) => {});
    this.selectedProduct = product;

    this.updateMode = false;
    this.costingForm = this.fb.group({
      cost: [
        null,
        [
          Validators.min(-100000000),
          Validators.max(100000000),
        ],
      ],
      quantity: [
        null,
        [
          Validators.min(-100000000),
          Validators.max(100000000),
        ],
      ],
      unit: [null],
      place: [this.defaultPlace]
    });
  }

  addToPurchaseList() {
    console.log(this.costingForm.value);

    if (this.util.validateForm(this.costingForm)) {
      console.log(this.costingForm.value);
    }
  }

}
