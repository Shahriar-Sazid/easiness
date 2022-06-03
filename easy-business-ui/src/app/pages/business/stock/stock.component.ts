import { Component, Input, OnInit } from '@angular/core';
import { TableColumn, ColumnMode } from '@swimlane/ngx-datatable';
import { Page } from 'src/app/core/models/page.model';
import { Product } from 'src/app/core/models/product.model';
import { Stock } from 'src/app/core/models/stock.model';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  @Input() viewMode: 'dedicated' | 'sell' = 'dedicated';
  productPage: Page<Stock> = new Page<Stock>();
  columns: TableColumn[];
  columnMode = ColumnMode;
  constructor() { }

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
  ngOnInit(): void {
  }

  resetForm() {
    this.searchOptions.name = "";
    this.searchOptions.type = "";
    this.searchOptions.brand = "";
    this.searchOptions.page = 1;
    this.searchOptions.pageSize = 10;
    // this.search();
  }
}
