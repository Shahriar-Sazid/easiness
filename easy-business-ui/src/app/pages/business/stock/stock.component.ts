import { Component, Input, OnInit } from '@angular/core';
import { TableColumn, ColumnMode } from '@swimlane/ngx-datatable';
import { Page } from 'src/app/core/models/page.model';
import { Stock } from 'src/app/core/models/stock.model';
import { BusinessService } from 'src/app/core/services/business.service';
import { PlaceService } from 'src/app/core/services/place.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  @Input() viewMode: 'dedicated' | 'sell' = 'dedicated';
  stockPage: Page<Stock> = new Page<Stock>();
  columns: TableColumn[];
  columnMode = ColumnMode;
  selectedStock: number;
  constructor(private businessService: BusinessService, public placeService: PlaceService) { }


  searchOptions: SearchOptions;

  searchedOptions: SearchOptions;

  dedicatedMode: ViewMode = {
    move: true,
    report: true,
    select: false
  }

  sellMode: ViewMode = {
    move: false,
    report: false,
    select: true 
  }

  currentMode: ViewMode;
  ngOnInit(): void {
    if (this.viewMode == 'sell') {
      this.currentMode = this.sellMode;
    } else if (this.viewMode == 'dedicated') {
      this.currentMode = this.dedicatedMode;
    }

    if(!this.placeService.placeRecord) {
      this.placeService.getAllPlace();
    }
    this.searchOptions = {
      page: 1,
      pageSize: environment.pageSize,
    } as SearchOptions;

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
      {
        name: "Place",
        cellClass: "text-center",
      },
      {
        name: "Quantity Unit",
        cellClass: "text-center",
      },
      {
        name: "Unit Cost",
        cellClass: "text-center",
      },
      {
        name: "Total Cost",
        cellClass: "text-center",
      }
    ];
    this.searchStock();
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
    this.selectedStock = event.row;
  }

  changePage(event) {
    this.searchedOptions.page = event.offset + 1;
    this.search();
  }

  searchStock() {
    this.searchOptions.page = 1;
    this.searchedOptions = JSON.parse(JSON.stringify(this.searchOptions));
    this.search();
  }

  search() {
    this.businessService.getStock(this.searchedOptions)
    .subscribe(
      (data) => {
        data.content.forEach(el => {
          el['quantityUnit'] = `${el.quantity} ${el.unit}`
          el['unitCost'] = el.cost;
          el['totalCost'] = (el.cost * el.quantity).toFixed(2)
        })
        this.stockPage = data;
      },
      (err) => {
        console.error(err);
      }
    );
  }
}

interface ViewMode {
  move: boolean;
  report: boolean;
  select: boolean;
}

type SearchOptions = {
  name: string;
  type: string;
  brand: string;
  place: string;
  page: number;
  pageSize: number;
}