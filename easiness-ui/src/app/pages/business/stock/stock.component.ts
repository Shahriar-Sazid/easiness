import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableColumn, ColumnMode } from '@swimlane/ngx-datatable';
import clone from 'just-clone';
import { Page } from 'src/app/core/models/page.model';
import { Stock } from 'src/app/core/models/stock.model';
import { PlacePipe } from 'src/app/core/pipes/place.pipe';
import { BusinessService } from 'src/app/core/services/business.service';
import { PlaceService } from 'src/app/core/services/place.service';
import { APP_CONFIG } from 'src/environments/environment';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
  providers: [PlacePipe]
})
export class StockComponent implements OnInit {
  @Output() stockSelected: EventEmitter<any> = new EventEmitter();
  @Input() viewMode: 'dedicated' | 'sell' = 'dedicated';
  stockPage: Page<Stock> = new Page<Stock>();
  columns: TableColumn[];
  columnMode = ColumnMode;
  selectedStock: Stock;

  isLoading = false;
  constructor(private businessService: BusinessService, public placeService: PlaceService, private placePipe: PlacePipe) {
    this.searchStock = this.searchStock.bind(this);
  }


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

  defaultSearchOptions = {
    page: 1,
    pageSize: APP_CONFIG.pageSize,
  } as SearchOptions;

  currentMode: ViewMode;
  ngOnInit(): void {
    if (this.viewMode == 'sell') {
      this.currentMode = this.sellMode;
    } else if (this.viewMode == 'dedicated') {
      this.currentMode = this.dedicatedMode;
    }

    if (!this.placeService.placeRecord) {
      this.placeService.getAllPlace();
    }
    this.searchOptions = clone(this.defaultSearchOptions);

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
        prop: "place",
        pipe: this.placePipe,
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
    this.searchOptions = clone(this.defaultSearchOptions);
    this.search();
  }

  onActivate(event: any) {
    // console.log(event.row);
    this.selectedStock = event.row;
  }

  changePage(event: { offset: number; }) {
    this.searchedOptions.page = event.offset + 1;
    this.search();
  }

  searchStock() {
    this.searchOptions.page = 1;
    this.searchedOptions = clone(this.searchOptions);
    this.search();
  }

  search() {
    this.isLoading = true;
    this.businessService.getStock(this.searchedOptions)
      .subscribe(
        (data) => {
          data.content.forEach(el => {
            el['quantityUnit'] = `${el.quantity} ${el.unitTxt}`
            el['stockPlace'] = el.placeTxt;
            el['unitCost'] = el.cost;
            el['totalCost'] = (el.cost * el.quantity).toFixed(2)
          })
          this.stockPage = data;
        },
        (err) => {
          console.error(err);
        }, () => {
          this.isLoading = false;
        }
      );
  }

  selectStock() {
    this.stockSelected.emit(this.selectedStock);
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
  placeId: string;
  page: number;
  pageSize: number;
}
