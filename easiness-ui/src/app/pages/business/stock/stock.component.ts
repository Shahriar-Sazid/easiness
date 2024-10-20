import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ColumnMode, TableColumn } from '@swimlane/ngx-datatable'
import clone from 'just-clone'
import { Page } from 'src/app/core/models/page.model'
import { Stock } from 'src/app/core/models/stock.model'
import { AmountPipe } from 'src/app/core/pipes/amount.pipe'
import { PlacePipe } from 'src/app/core/pipes/place.pipe'
import { PDFService } from 'src/app/core/services/pdf.service'
import { PlaceService } from 'src/app/core/services/place.service'
import { StockWebService } from 'src/app/core/services/stock.service'
import { UtilService } from 'src/app/core/services/util.service'
import { APP_CONFIG } from 'src/environments/environment'

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
  providers: [PlacePipe, AmountPipe]
})
export class StockComponent implements OnInit {
  @Output() stockSelected: EventEmitter<any> = new EventEmitter()
  @Input() viewMode: 'dedicated' | 'sell' = 'dedicated'
  stockPage: Page<Stock> = new Page<Stock>()
  columns: TableColumn[]
  columnMode = ColumnMode
  selectedStock: Stock

  isLoading = false
  constructor(public placeService: PlaceService,
    private stockService: StockWebService,
    public amountPipe: AmountPipe,
    private util: UtilService,
    private pdfService: PDFService,
    private placePipe: PlacePipe) {
    this.searchStock = this.searchStock.bind(this)
  }


  searchOptions: SearchOptions


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
  } as SearchOptions

  currentMode: ViewMode
  ngOnInit(): void {
    if (this.viewMode == 'sell') {
      this.currentMode = this.sellMode
    } else if (this.viewMode == 'dedicated') {
      this.currentMode = this.dedicatedMode
    }

    this.searchOptions = clone(this.defaultSearchOptions)

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
        pipe: this.amountPipe,
        cellClass: "text-center",
      },
      {
        name: "Total Cost",
        pipe: this.amountPipe,
        cellClass: "text-center",
      }
    ]
    this.searchStock()
  }

  resetForm() {
    this.searchOptions = clone(this.defaultSearchOptions)
    this.search()
  }

  onActivate(event: any) {
    // console.log(event.row)
    this.selectedStock = event.row
  }

  changePage(event: { offset: number }) {
    this.searchOptions.page = event.offset + 1
    this.search()
  }

  searchStock() {
    this.searchOptions.page = 1
    this.search()
  }

  search() {
    this.isLoading = true
    this.stockService.getStock(this.searchOptions)
      .subscribe(
        (data) => {
          data.content.forEach(el => {
            el['quantityUnit'] = `${el.quantity % 1 ? el.quantity.toFixed(2) : el.quantity} ${el.unitTxt}`
            el['stockPlace'] = el.placeTxt
            el['unitCost'] = el.cost
            el['totalCost'] = (el.cost * el.quantity).toFixed(2)
          })
          this.stockPage = data
        },
        (err) => {
          console.error(err)
        }, () => {
          this.isLoading = false
        }
      )
  }

  selectStock() {
    this.stockSelected.emit(this.selectedStock)
  }

  downloadAsReport({ name, type, brand, placeId }) {
    const activeFilters = this.util.filterAndJoin([
      name ? `Product Name: ${name}` : undefined,
      type ? `Product Type: ${type}` : undefined,
      brand ? `Brand: ${brand}` : undefined,
      placeId ? `Place: ${this.placePipe.transform(placeId)}` : undefined,
    ], " ")

    const reportOptions = {
      ...this.searchOptions,
      activeFilters
    }

    reportOptions.page = 1
    reportOptions.pageSize = 10000000

    this.stockService.getStock(reportOptions).subscribe(data => {
      const rows = []
      for (const el of data.content) {
        rows.push([
          { text: el.name, fontSize: 10 },
          { text: el.type, fontSize: 10 },
          { text: el.brand, fontSize: 10 },
          { text: el.country, fontSize: 10 },
          { text: el.size, fontSize: 10 },
          { text: el.placeTxt, fontSize: 10 },
          { text: `${el.quantity % 1 ? el.quantity.toFixed(2) : el.quantity} ${el.unitTxt}`, fontSize: 10 },
          { text: this.amountPipe.transform(el.cost, true, 'Tk '), fontSize: 10 },
        ])
      }

      let dd = this.pdfService.getListTemplate(
        ["Name", "Type", "Brand", "Country", "Size", "Place", "Quantity", "Cost/Unit"]
          .map(el => ({ text: el, style: "tableHeader" })),
        rows, reportOptions.activeFilters, '*')

      this.pdfService.open(dd)
    })
  }
}

interface ViewMode {
  move: boolean
  report: boolean
  select: boolean
}

type SearchOptions = {
  name: string
  type: string
  brand: string
  placeId: string
  page: number
  pageSize: number
}
