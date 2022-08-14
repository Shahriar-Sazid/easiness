import { Component, OnInit, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TableColumn, ColumnMode } from "@swimlane/ngx-datatable";
import clone from "just-clone";
import { validationMessages } from "src/app/core/helpers/validation/validation-message";
import { Account } from "src/app/core/models/accounting.model";
import { Page } from "src/app/core/models/page.model";
import { AccountingService } from "src/app/core/services/accounting.service";
import { UtilService } from "src/app/core/services/util.service";
@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"],
})
export class AccountComponent implements OnInit {
  @ViewChild(NgbActiveModal) addAccountModal: NgbActiveModal;
  accountPage: Page<Account> = new Page<Account>();
  columns: TableColumn[];
  columnMode = ColumnMode;

  searchOptions: {
    accountName: string;
    accountNo: string;
    page: number;
    pageSize: number;
  };

  searchedOptions: any;
  selectedAccount: Account;
  updateMode: boolean;
  accountForm: UntypedFormGroup;
  validationMessage = validationMessages;

  constructor(
    private accountService: AccountingService,
    private modalService: NgbModal,
    // private spinner: NgxSpinnerService,
    private fb: UntypedFormBuilder,
    public util: UtilService,
    private activatedRouter: ActivatedRoute,
    private router: Router
  ) {
    this.searchOptions = {
      accountName: "",
      accountNo: "",
      page: 1,
      pageSize: 10,
    };
  }

  ngOnInit() {
    this.columns = [
      {
        name: "Account Name",
        prop: "accountName",
        cellClass: "text-center",
      },
      {
        name: "Holder Name",
        prop: "holderName",
        cellClass: "text-center",
      },
      {
        name: "Bank",
        prop: "bank",
        cellClass: "text-center",
      },
      {
        name: "Branch",
        prop: "branch",
        cellClass: "text-center",
      },
      {
        name: "Account No",
        prop: "accountNo",
        cellClass: "text-center",
      },
      {
        name: "Balance",
        prop: "balance",
        cellClass: "text-center",
      },
    ];

    this.activatedRouter.queryParams.subscribe((params) => {
      this.searchedOptions = clone(params);
      this.search();
    });
  }

  searchAccount() {
    this.searchOptions.page = 1;
    this.searchOptions.pageSize = 10;
    this.searchedOptions = clone(this.searchOptions);
    this.router.navigate([], {
      queryParams: this.searchedOptions,
    });
  }

  resetForm() {

  }

  downloadAsReport() {
    let keyNameMap = {
      accountName: "Account Name",
      accountNo: "Account No",
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
    this.accountService.downloadAsReport(reportOptions).subscribe((data) => {
      this.util.downLoadFile(data, "application/pdf");
    });
  }

  onActivate(event: any) {
    // console.log(event.row);
    this.selectedAccount = event.row;
  }

  changePage(event) {
    this.searchedOptions.page = event.offset + 1;
    this.search();
  }

  search() {
    this.accountService.getAccount(this.searchedOptions).subscribe(
      (data: Page<Account>) => {
        console.log(data);
        this.accountPage = data;
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
