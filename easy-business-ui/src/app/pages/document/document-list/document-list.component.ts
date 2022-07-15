import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { TableColumn, ColumnMode } from '@swimlane/ngx-datatable';
import { map } from 'rxjs/operators';
import { DateRange, DocumentSearchRes, DocumentType } from 'src/app/core/models/document.model';
import { Page } from 'src/app/core/models/page.model';
import { Product } from 'src/app/core/models/product.model';
import { DocumentService } from 'src/app/core/services/document.service';
import { ProductService } from 'src/app/core/services/product.service';
import { UtilService } from 'src/app/core/services/util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit {

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
  ) {
    this.search = this.search.bind(this);
  }

  ngOnInit() {
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

    if (this.searchOptions.type == DocumentType.INVOICE) {
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
    // this.documentService.downloadAsReport(reportOptions).subscribe((data) => {
    //   this.util.downLoadFile(data, "application/pdf");
    // });
  }

  resetForm() {
    this.route.params.subscribe(params => {
      if (params.type == 'invoice') {
        this.searchOptions.type = DocumentType.INVOICE;
      } else this.searchOptions.type = DocumentType.PURCHASE_ORDER;
      this.searchDocument();
    });
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