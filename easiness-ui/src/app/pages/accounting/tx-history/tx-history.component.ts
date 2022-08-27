import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TableColumn, ColumnMode } from '@swimlane/ngx-datatable';
import clone from 'just-clone';
import { Tx, TxSearchOptions, TxType } from 'src/app/core/models/accounting.model';
import { DateRange } from 'src/app/core/models/document.model';
import { Page } from 'src/app/core/models/page.model';
import { AccountPipe } from 'src/app/core/pipes/account.pipe';
import { AmountPipe } from 'src/app/core/pipes/amount.pipe';
import { AccountingService } from 'src/app/core/services/accounting.service';
import { UtilService } from 'src/app/core/services/util.service';
import { DateRangeComponent } from 'src/app/shared/ui/date-range/date-range.component';
import { APP_CONFIG } from 'src/environments/environment';

@Component({
  selector: 'app-tx-history',
  templateUrl: './tx-history.component.html',
  styleUrls: ['./tx-history.component.scss'],
  providers: [AmountPipe, AccountPipe]
})
export class TxHistoryComponent implements OnInit {

  @ViewChild('dr', { static: true }) dateRangeComponent: DateRangeComponent;
  @Input() viewMode: 'dedicated' | 'buy' = 'dedicated';
  txPage: Page<Tx> = new Page<Tx>();
  columns: TableColumn[];
  columnMode = ColumnMode;
  TxTypes = TxType;

  isLoading = false;

  searchOptions: TxSearchOptions = {} as TxSearchOptions;

  searchedOptions: TxSearchOptions;
  selectedTx: Tx;

  constructor(
    private router: Router,
    public util: UtilService,
    public accountingService: AccountingService,
    private datePipe: DatePipe,
    private amountPipe: AmountPipe,
    private accountPipe: AccountPipe
  ) { }

  ngOnInit() {
    this.initializeState();
  }

  initializeState() {
    this.columns = [
      {
        name: "Date",
        cellClass: "text-center",
        pipe: { transform: (value: string) => this.datePipe.transform(value, APP_CONFIG.defaultDateFormat) }
      },
      {
        name: "People Name",
        cellClass: "text-center",
      },
      {
        name: "Amount",
        cellClass: "text-center",
        pipe: this.amountPipe
      },
      {
        name: "From Account",
        cellClass: "text-center",
        prop: 'fromAccountId',
        pipe: this.accountPipe
      },
      {
        name: "To Account",
        cellClass: "text-center",
        prop: 'toAccountId',
        pipe: this.accountPipe
      },
    ];

    this.resetForm();

  }

  searchTx() {
    this.searchOptions.page = 1;
    this.searchOptions.pageSize = 5;
    this.searchedOptions = clone(this.searchOptions);
    this.search();
  }

  changePage(event) {
    this.searchedOptions.page = event.offset + 1;
    this.search();
  }

  search() {
    this.isLoading = true;
    this.accountingService.searchTx(this.searchedOptions).subscribe(
      (data) => {
        console.log(data);
        this.txPage = data;
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
    // this.txService.downloadAsReport(reportOptions).subscribe((data) => {
    //   this.util.downLoadFile(data, "application/pdf");
    // });
  }

  resetForm() {
    this.searchOptions = {} as TxSearchOptions;
    this.dateRangeComponent.reset();
    this.searchTx();
  }

  onActivate(event: { row: Tx }) {
    // console.log(event.row);
    this.selectedTx = event.row;
  }

  selectDate(range: DateRange) {
    this.searchOptions = { ...this.searchOptions, ...range }
  }

  goToDetails() {
    this.router.navigateByUrl(`/tx/details/${this.selectedTx.id}`)
  }
}

