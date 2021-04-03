import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ColumnMode, TableColumn } from "@swimlane/ngx-datatable";
import { environment } from "src/environments/environment";
import * as _ from "lodash";
import { Page } from "src/app/core/models/page.model";
import { Product } from "src/app/core/models/product.model";
import { ProductService } from "src/app/core/services/product.service";
import { UtilService } from "src/app/core/services/util.service";
import { validationMessages } from "src/app/core/helpers/validation/validation-message";

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
})
export class ProductComponent implements OnInit {
  @ViewChild(NgbActiveModal) addProductModal: NgbActiveModal;
  productPage: Page<Product> = new Page<Product>();
  columns: TableColumn[];
  columnMode = ColumnMode;

  searchOptions: {
    name: string;
    type: string;
    brand: string;
    page: number;
    pageSize: number;
  };

  searchedOptions: {
    name: string;
    type: string;
    brand: string;
    page: number;
    pageSize: number;
  };
  updatingProduct: Product;

  newProductSizes: Set<string> = new Set();
  productForm: FormGroup;

  validationMessage = validationMessages;

  updateMode = false;
  constructor(
    private productService: ProductService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    public util: UtilService
  ) {}

  ngOnInit() {
    this.productForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      type: ["", [Validators.maxLength(25)]],
      brand: ["", [Validators.minLength(3), Validators.maxLength(25)]],
      country: ["", [Validators.required, Validators.maxLength(20)]],
      size: ["", [Validators.maxLength(25)]],
    });

    this.searchOptions = {
      name: "",
      type: "",
      brand: "",
      page: 1,
      pageSize: environment.pageSize,
    };
    this.columns = [
      {
        name: "Name",
        cellClass: "text-center",
      },
      {
        name: "Type",
        cellClass: "text-center",
      },
      {
        name: "Brand",
        cellClass: "text-center",
      },
      {
        name: "Country",
        cellClass: "text-center",
      },
      {
        name: "Size",
        cellClass: "text-center",
      },
    ];
    this.searchProduct();
  }

  searchProduct() {
    this.searchOptions.page = 1;
    this.searchOptions.pageSize = 10;
    this.searchedOptions = _.clone(this.searchOptions);
    this.search();
  }

  changePage(event) {
    this.searchedOptions.page = event.offset + 1;
    this.search();
  }

  search() {
    this.productService.getProduct(this.searchedOptions).subscribe(
      (data) => {
        console.log(data);
        this.productPage = data;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  downloadAsReport() {
    let keyNameMap = {
      name: "Name",
      type: "Type",
      brand: "Brand",
    };
    let reportOptions = {
      ...this.searchedOptions,
      activeFilters: this.util.buildActiveFilters(this.searchedOptions, keyNameMap),
    };
    reportOptions.page = 1;
    reportOptions.pageSize = 10000000;
    this.productService.downloadAsReport(reportOptions).subscribe((data) => {
      this.util.downLoadFile(data, "application/pdf");
    });
  }

  resetForm() {
    this.searchOptions.name = "";
    this.searchOptions.type = "";
    this.searchOptions.brand = "";
    this.searchOptions.page = 1;
    this.searchOptions.pageSize = 10;
    this.search();
  }

  onActivate(event: any) {
    console.log(event.row);
    this.updatingProduct = event.row;
  }

  openProductModal(content, updateMode: boolean) {
    if (updateMode) {
      this.updateMode = true;
      for (let [control] of Object.entries(this.productForm.controls)) {
        this.productForm.get(control).setValue(this.updatingProduct[control]);
      }
    } else {
      this.updateMode = false;
    }
    this.modalService.open(content);
  }

  addProductSize(sizeInput) {
    let size = sizeInput.value.trim();
    if (size) {
      this.newProductSizes.add(size);
    }
    console.log(this.newProductSizes);
  }

  removeProductSize(sizeToken: HTMLSpanElement) {
    let size = sizeToken.textContent.trim();
    this.newProductSizes.delete(size);
    console.log(this.newProductSizes);
  }

  addOrUpdateProduct() {
    if (this.util.validateForm(this.productForm)) {
      if (this.updateMode) {
        // this.spinner.show();
        for (let [key, value] of Object.entries(this.productForm.value)) {
          this.updatingProduct[key] = value;
        }
        this.productService
          .updateProduct(this.updatingProduct)
          .subscribe(
            (data) => {
              this.search();
              // this.toastrService.success("Products updated successfully");
            },
            (err) => {
              console.log(err);
              // this.toastrService.error(err.error.message);
            }
          )
          .add(() => {
            this.productForm.reset();
            // this.spinner.hide();
            this.modalService.dismissAll();
          });
      } else {
        let { size, ...newProducts } = this.productForm.value;
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
              this.search();
              // this.toastrService.success("Products added successfully");
            },
            (err) => {
              console.log(err);
              // this.toastrService.error(err.error.message);
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
