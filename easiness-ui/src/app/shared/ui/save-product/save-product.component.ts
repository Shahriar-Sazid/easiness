import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from 'src/app/core/services/product.service';
import { UtilService } from 'src/app/core/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-save-product',
  templateUrl: './save-product.component.html',
  styleUrls: ['./save-product.component.scss']
})
export class SaveProductComponent implements OnInit {
  @ViewChild('productModal') addProductModal: any;
  updateMode: boolean;
  productForm: UntypedFormGroup;
  @Input() callback: Function;
  @Input() updatingProduct: any;
  newProductSizes: Set<string> = new Set();

  constructor(private fb: UntypedFormBuilder,
    public util: UtilService,
    private productService: ProductService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      type: ["", [Validators.maxLength(25)]],
      brand: ["", [Validators.minLength(3), Validators.maxLength(25)]],
      country: ["", [Validators.required, Validators.maxLength(20)]],
      size: ["", [Validators.maxLength(25)]],
    });
  }

  openProductModal(updateMode: boolean) {
    if (updateMode) {
      this.updateMode = true;
      for (const [control] of Object.entries(this.productForm.controls)) {
        this.productForm.get(control).setValue(this.updatingProduct[control]);
      }
    } else {
      this.updateMode = false;
    }
    this.modalService.open(this.addProductModal);
  }

  addProductSize(sizeInput) {
    const size = sizeInput.value.trim();
    if (size) {
      this.newProductSizes.add(size);
    }
    console.log(this.newProductSizes);
  }

  removeProductSize(sizeToken: HTMLSpanElement) {
    const size = sizeToken.textContent.trim();
    this.newProductSizes.delete(size);
    console.log(this.newProductSizes);
  }

  addOrUpdateProduct() {
    if (this.util.validateForm(this.productForm)) {
      if (this.updateMode) {
        // this.spinner.show();
        for (const [key, value] of Object.entries(this.productForm.value)) {
          this.updatingProduct[key] = value;
        }
        this.productService
          .updateProduct(this.updatingProduct)
          .subscribe(
            (data) => {
              this.callback();
              Swal.fire('Good job!', 'Product updated successfully', 'success');
            },
            (err) => {
              console.log(err);
              Swal.fire('Failed!', err.error.message, 'error');
            }
          )
          .add(() => {
            this.productForm.reset();
            // this.spinner.hide();
            this.modalService.dismissAll();
          });
      } else {
        const { size, ...newProducts } = this.productForm.value;
        if (size) {
          if (size.trim()) {
            this.newProductSizes.add(size.trim());
          }
        }
        newProducts.sizes = Array.from(this.newProductSizes);
        // this.spinner.show();
        console.log(this.productForm);

        this.productService
          .addProducts(newProducts)
          .subscribe(
            (data) => {
              this.callback();
              Swal.fire('Good job!', 'Product added successfully', 'success');
            },
            (err) => {
              console.log(err);
              Swal.fire('Failed!', err.error.message, 'error');
            }
          )
          .add(() => {
            this.productForm.reset();
            this.newProductSizes = new Set<string>();
            // this.spinner.hide();
            this.modalService.dismissAll();
          });
      }
    }
  }


  clearProductForm() {
    this.productForm.reset();
  }

  closeProductModal() {
    this.clearProductForm();
    this.modalService.dismissAll();
  }

}
