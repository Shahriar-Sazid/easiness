import { Component, Input, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Stock } from 'src/app/core/models/stock.model';
import { PlaceService } from 'src/app/core/services/place.service';
import { ProductService } from 'src/app/core/services/product.service';
import { UnitService } from 'src/app/core/services/unit.service';
import { UtilService } from 'src/app/core/services/util.service';
import { ValidatePlace, ValidateSaleQuantityUnit } from 'src/app/core/validation/custom-validation';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-move-product',
  templateUrl: './move-product.component.html',
  styleUrls: ['./move-product.component.scss']
})
export class MoveProductComponent {

  @ViewChild('moveProductModal') content: unknown;
  updateMode: boolean;
  moveProductForm: UntypedFormGroup;
  @Input('callback') callback: () => void;
  @Input() selectedStock: Stock;

  constructor(private fb: UntypedFormBuilder,
    public util: UtilService,
    public placeService: PlaceService,
    public unitService: UnitService,
    public productService: ProductService,
    private modalService: NgbModal) { }

  getStockDetail(): string {
    return this.util.filterAndJoin((
      (stk: Stock) => [stk.name, stk.type, stk.brand, stk.country, stk.size, stk.placeTxt])(this.selectedStock))
  }

  openMoveProductModal() {
    this.modalService.open(this.content, {
      backdrop: "static",
    });
    this.moveProductForm = this.fb.group({
      quantity: [0, [Validators.required]],
      unit: [this.selectedStock.unit, [Validators.required]],
      toPlace: [undefined, [Validators.required, ValidatePlace(this.selectedStock.place)]],
    }, { validators: ValidateSaleQuantityUnit(this.selectedStock.quantity, this.selectedStock.unit, this.unitService) });
  }

  close() {
    this.moveProductForm.reset();
    this.modalService.dismissAll();
  }

  move() {
    if (this.moveProductForm.valid) {
      this.productService.move({ ...this.moveProductForm.value, stockId: this.selectedStock.id })
        .subscribe(data => {
          Swal.fire('Good job!', 'Product moved successfully', 'success');
          this.modalService.dismissAll();
          this.callback();
        });
    }

  }

}
