import { Component, OnInit, ViewChild } from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ColumnMode, TableColumn } from "@swimlane/ngx-datatable";
import clone from "just-clone";
import { validationMessages } from "src/app/core/helpers/validation/validation-message";
import { Page } from "src/app/core/models/page.model";
import { People } from "src/app/core/models/people.model";
import { AmountPipe } from "src/app/core/pipes/amount.pipe";
import { PeopleService } from "src/app/core/services/people.service";
import { UtilService } from "src/app/core/services/util.service";

@Component({
  selector: "app-people",
  templateUrl: "./people.component.html",
  styleUrls: ["./people.component.scss"],
  providers: [AmountPipe]
})
export class PeopleComponent implements OnInit {
  @ViewChild(NgbActiveModal) addPeopleModal: NgbActiveModal;
  peoplePage: Page<People> = new Page<People>();
  columns: TableColumn[];
  columnMode = ColumnMode;

  searchOptions: {
    name: string;
    contactNo: string;
    page: number;
    pageSize: number;
  };

  searchedOptions: any;
  selectedPeople: People;
  updateMode: boolean;
  peopleForm: UntypedFormGroup;
  validationMessage = validationMessages;

  constructor(
    private peopleService: PeopleService,
    public util: UtilService,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private amountPipe: AmountPipe,
  ) {
    this.searchOptions = {
      name: "",
      contactNo: "",
      page: 1,
      pageSize: 10,
    };
    this.search = this.search.bind(this);
  }



  ngOnInit() {
    this.columns = [
      {
        prop: "name",
        cellClass: "text-center",
      },
      {
        prop: "companyName",
        cellClass: "text-center",
      },
      {
        name: "Address",
        prop: "address",
        cellClass: "text-center",
      },
      {
        prop: "email",
        cellClass: "text-center",
      },
      {
        prop: "type",
        cellClass: "text-center",
      },
      {
        prop: "contactNumber",
        cellClass: "text-center",
      },
      {
        prop: "balance",
        cellClass: "text-center",
        pipe: this.amountPipe
      },
    ];

    this.activatedRouter.queryParams.subscribe((params) => {
      this.searchedOptions = clone(params);
      this.search();
    });
  }

  searchPeople() {
    this.searchOptions.page = 1;
    this.searchOptions.pageSize = 10;
    this.searchedOptions = clone(this.searchOptions);
    this.router.navigate([], {
      queryParams: this.searchedOptions,
    });
  }

  resetForm() { 
    //TODO: implement me!!
  }



  downloadAsReport() {
    const keyNameMap = {
      name: "Name",
      contactNo: "Contact No",
    };
    const reportOptions = {
      ...this.searchedOptions,
      activeFilters: this.util.buildActiveFilters(this.searchedOptions, keyNameMap),
    };
    reportOptions.page = 1;
    reportOptions.pageSize = 10000000;
    this.peopleService.downloadAsReport(reportOptions).subscribe((data) => {
      this.util.downLoadFile(data, "application/pdf");
    });
  }

  onActivate(event: any) {
    // console.log(event.row);
    this.selectedPeople = event.row;
  }

  changePage(event) {
    this.searchedOptions.page = event.offset + 1;
    this.search();
  }

  search() {
    this.peopleService.getPeople(this.searchedOptions).subscribe(
      (data: Page<People>) => {
        console.log(data);
        for (const people of data.content) {
          people.contactNumber = people.contactNoList.map((contactNo) => contactNo.contactNo).join(",\n");
        }
        this.peoplePage = data;
      },
      (err) => {
        console.error(err);
      }
    );
  }


}
