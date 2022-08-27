import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ColumnMode, TableColumn } from "@swimlane/ngx-datatable";
import { APP_CONFIG } from "src/environments/environment";
// import * as _ from "lodash";
import { Page } from "src/app/core/models/page.model";
import { Product } from "src/app/core/models/product.model";
import { ProductService } from "src/app/core/services/product.service";
import { UtilService } from "src/app/core/services/util.service";
import clone from "just-clone";

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
})
export class ProductComponent implements OnInit {
  @Output() productSelected: EventEmitter<any> = new EventEmitter();
  @Input() viewMode: 'dedicated' | 'buy' = 'dedicated';
  productPage: Page<Product> = new Page<Product>();
  columns: TableColumn[];
  columnMode = ColumnMode;

  dedicatedMode: ViewMode = {
    add: true,
    update: true,
    report: true,
    select: false
  }

  buyMode: ViewMode = {
    add: false,
    update: false,
    report: false,
    select: true
  }

  currentMode: ViewMode;

  isLoading = false;

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

  selectedProduct: Product;

  constructor(
    private productService: ProductService,
    public util: UtilService
  ) {
    this.search = this.search.bind(this);
  }

  ngOnInit() {
    if(this.viewMode == 'buy') {
      this.currentMode = this.buyMode;
    } else if(this.viewMode == 'dedicated') {
      this.currentMode = this.dedicatedMode;
    }

    this.searchOptions = {
      name: "",
      type: "",
      brand: "",
      page: 1,
      pageSize: APP_CONFIG.pageSize,
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
    this.searchedOptions = clone(this.searchOptions);
    this.search();
  }

  changePage(event) {
    this.searchedOptions.page = event.offset + 1;
    this.search();
  }

  search() {
    this.isLoading = true;
    this.productService.getProduct(this.searchedOptions).subscribe(
      (data) => {
        console.log(data);
        this.productPage = data;
      },
      (err) => {
        console.error(err);
      }, () => {
        this.isLoading = false;
      }
    );
  }

  downloadAsReport() {
    const keyNameMap = {
      name: "Name",
      type: "Type",
      brand: "Brand",
    };
    const reportOptions = {
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
    // console.log(event.row);
    this.selectedProduct = event.row;
  }

  selectProduct() {
    this.productSelected.emit(this.selectedProduct);
  }
}

interface ViewMode {
  add: boolean;
  update: boolean;
  report: boolean;
  select: boolean;
}
