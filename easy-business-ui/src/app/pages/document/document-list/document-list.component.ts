import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnMode, TableColumn } from '@swimlane/ngx-datatable';
import { map } from 'rxjs/operators';
import { DateRange, DocumentSearchRes, DocumentType } from 'src/app/core/models/document.model';
import { Page } from 'src/app/core/models/page.model';
import { DocumentService } from 'src/app/core/services/document.service';
import { UtilService } from 'src/app/core/services/util.service';
import { DateRangeComponent } from 'src/app/shared/ui/date-range/date-range.component';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit {
  @ViewChild('dr', { static: true }) dateRangeComponent: DateRangeComponent;
  @Output() onDocumentSelected: EventEmitter<any> = new EventEmitter();
  @Input() viewMode: 'dedicated' | 'buy' = 'dedicated';
  documentPage: Page<DocumentSearchRes> = new Page<DocumentSearchRes>();
  columns: TableColumn[];
  columnMode = ColumnMode;

  isLoading = false;

  searchOptions: SearchOptions = {} as SearchOptions;

  searchedOptions: SearchOptions;
  selectedDocument: DocumentSearchRes;

  constructor(
    private documentService: DocumentService,
    private route: ActivatedRoute,
    public util: UtilService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.searchOptions.type = params['type'] === 'invoice' ? DocumentType.INVOICE : DocumentType.PURCHASE_ORDER;
      this.initializeState();
    });
  }

  initializeState() {
    this.columns = [
      {
        name: "Date",
        cellClass: "text-center",
      },
      {
        name: "People Name",
        cellClass: "text-center",
      },
      {
        name: "Total",
        cellClass: "text-center",
      },
    ];

    this.resetForm();

    if (this.searchOptions.type === DocumentType.INVOICE) {
      this.columns.push({
        name: "Profit",
        cellClass: "text-center",
      })
    }
  }

  searchDocument() {
    this.searchOptions.page = 1;
    this.searchOptions.pageSize = 5;
    this.searchedOptions = JSON.parse(JSON.stringify(this.searchOptions));
    this.search();
  }

  changePage(event) {
    this.searchedOptions.page = event.offset + 1;
    this.search();
  }

  search() {
    this.isLoading = true;
    this.documentService.getDocument(this.searchedOptions).pipe(map(res => {
      res.content.forEach(el => {
        el.date = this.datePipe.transform(new Date(el.date), 'dd-MM-yy hh:mm a')
      })
      return res;
    })).subscribe(
      (data) => {
        console.log(data);
        this.documentPage = data;
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
    // this.documentService.downloadAsReport(reportOptions).subscribe((data) => {
    //   this.util.downLoadFile(data, "application/pdf");
    // });
  }

  resetForm() {
    this.searchOptions = {} as SearchOptions;
    this.dateRangeComponent.reset();
    this.searchOptions.type =
      this.route.snapshot.paramMap.get('type') === 'invoice' ?
        DocumentType.INVOICE : DocumentType.PURCHASE_ORDER;
    this.searchDocument();
  }

  onActivate(event: any) {
    // console.log(event.row);
    this.selectedDocument = event.row;
  }

  selectProduct() {
    this.onDocumentSelected.emit(this.selectedDocument);
  }

  selectDate(range: DateRange) {
    this.searchOptions = { ...this.searchOptions, ...range }
  }
}

type SearchOptions = {
  from: Date;
  to: Date;
  peopleName: string;
  type: DocumentType;
  page: number;
  pageSize: number;
};