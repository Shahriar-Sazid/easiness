import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, TableColumn } from '@swimlane/ngx-datatable';
import { Tx, TxSearchOptions, TxType } from 'src/app/core/models/accounting.model';
import { DateRange } from 'src/app/core/models/document.model';
import { Page } from 'src/app/core/models/page.model';
import { AccountPipe } from 'src/app/core/pipes/account.pipe';
import { AmountPipe } from 'src/app/core/pipes/amount.pipe';
import { PeoplePipe } from 'src/app/core/pipes/people.pipe';
import { AccountingService } from 'src/app/core/services/iface/account.service';
import { PeopleService } from 'src/app/core/services/iface/people.service';
import { PDFService } from 'src/app/core/services/pdf.service';
import { UtilService } from 'src/app/core/services/util.service';
import { DateRangeComponent } from 'src/app/shared/ui/date-range/date-range.component';
import { APP_CONFIG } from 'src/environments/environment';

@Component({
  selector: 'app-tx-history',
  templateUrl: './tx-history.component.html',
  styleUrls: ['./tx-history.component.scss'],
  providers: [AmountPipe, AccountPipe, PeoplePipe]
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

  selectedTx: Tx;

  constructor(
    private router: Router,
    public util: UtilService,
    public accountingService: AccountingService,
    private datePipe: DatePipe,
    private amountPipe: AmountPipe,
    private accountPipe: AccountPipe,
    private peoplePipe: PeoplePipe,
    public peopleService: PeopleService,
    private activatedRoute: ActivatedRoute,
    private pdfService: PDFService,
  ) {

  }

  ngOnInit() {
    this.initializeState();
    this.activatedRoute.queryParams.subscribe(data => {
      let searchOptions: TxSearchOptions
      if (this.counter()() === 1) {
        if (this.util.deepEqual(data, {})) {
          searchOptions = this.defaultSearchOptions()
        } else {
          searchOptions = JSON.parse(JSON.stringify(data))
        }
      }
      this.searchOptions = searchOptions
      this.search(searchOptions)
    })
  }

  counter() {
    let cnt = 0
    return function () {
      cnt++
      return cnt
    }
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
  }

  searchTx() {
    this.searchOptions.page = 1;
    this.searchOptions.pageSize = APP_CONFIG.pageSize;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.searchOptions
    })
  }

  changePage(event) {
    this.searchOptions.page = event.offset + 1;
    this.search(this.searchOptions);
  }

  search(searchOptions: TxSearchOptions) {
    this.isLoading = true
    this.accountingService.searchTx(searchOptions).subscribe(
      data => {
        console.log(data);
        this.txPage = data;
      },
      err => {
        console.error(err);
      }, () => {
        this.isLoading = false;
      }
    );
  }

  downloadAsReport({ from, to, type, account: accountId, peopleId }) {
    const activeFilters = this.util.filterAndJoin([
      from ? `From Date: ${this.datePipe.transform(from, APP_CONFIG.defaultDateFormat)}` : undefined,
      to ? `To Date: ${this.datePipe.transform(to, APP_CONFIG.defaultDateFormat)}` : undefined,
      type ? `Transaction Type: ${TxType[type]?.text}` : undefined,
      accountId ? `Account: ${this.accountPipe.transform(accountId)}` : undefined,
      peopleId ? `People: ${this.peoplePipe.transform(peopleId)}` : undefined,
    ], "; ")

    const reportOptions = {
      ...this.searchOptions,
      activeFilters
    };

    reportOptions.page = 1;
    reportOptions.pageSize = 10000000;

    this.accountingService.searchTx(reportOptions).subscribe(data => {
      const rows = []
      for (const el of data.content) {
        rows.push([
          { text: this.datePipe.transform(el.date, APP_CONFIG.defaultDateFormat), fontSize: 10 },
          { text: TxType[el.type]?.text, fontSize: 10 },
          { text: el.peopleName, fontSize: 10 },
          { text: this.amountPipe.transform(el.amount, true, 'Tk '), fontSize: 10 },
          { text: this.accountPipe.transform(el.fromAccountId), fontSize: 10 },
          { text: this.accountPipe.transform(el.toAccountId), fontSize: 10 },
        ])
      }

      let dd = this.pdfService.getListTemplate(
        ["Date Time", "Tx Type", "People", "Amount", "From Account", "To Account"]
          .map(el => ({ text: el, style: "tableHeader" })),
        rows, reportOptions.activeFilters, '*')

      this.pdfService.open(dd)
    });
    // this.txService.downloadAsReport(reportOptions).subscribe((data) => {
    //   this.util.downLoadFile(data, "application/pdf");
    // });
  }

  defaultSearchOptions(): TxSearchOptions {
    const from = new Date()
    from.setMonth(from.getMonth() - 1)
    from.setHours(0, 0, 0, 0)
    return {
      from,
      to: new Date(),
    } as TxSearchOptions
  }

  resetForm() {
    this.searchOptions = this.defaultSearchOptions()
    setTimeout(() => this.dateRangeComponent.reset(), 0)
    this.dateRangeComponent.reset()
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.searchOptions
    })
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

