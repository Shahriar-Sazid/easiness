import { Component, OnInit } from "@angular/core";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { People } from "src/app/core/models/people.model";
import { Place } from "src/app/core/models/place.model";
import { PeopleService } from "src/app/core/services/people.service";
import { PlaceService } from "src/app/core/services/place.service";
import { UtilService } from "src/app/core/services/util.service";

@Component({
  selector: "app-buy",
  templateUrl: "./buy.component.html",
  styleUrls: ["./buy.component.scss"],
})
export class BuyComponent implements OnInit {
  date: Date;
  today: NgbDate;

  supplierList: People[];
  placeList: Place[];
  constructor(
    private peopleService: PeopleService,
    private placeService: PlaceService,
    private util: UtilService
  ) {
    this.getAllSupplier = this.getAllSupplier.bind(this);
    this.getAllPlace = this.getAllPlace.bind(this);
  }

  ngOnInit(): void {
    this.date = new Date();
    this.today = this.util.getNgbToday();

    this.getAllSupplier();
    this.getAllPlace();
  }

  getAllSupplier() {
    this.peopleService
      .getAllSupplier()
      .subscribe((arg) => (this.supplierList = arg));
  }

  getAllPlace() {
    this.placeService
      .getPlace({
        page: 1,
        pageSize: 99999999,
      })
      .subscribe((arg) => (this.placeList = arg.content));
  }
}
