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
import Swal from "sweetalert2";

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
})
export class ProductComponent implements OnInit {
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

  constructor(
    private productService: ProductService,
    public util: UtilService
  ) {
    this.search = this.search.bind(this);
  }

  ngOnInit() {
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
      activeFilters: this.util.buildActiveFilters(
        this.searchedOptions,
        keyNameMap
      ),
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
}
