import { Component, OnInit, ViewChild } from "@angular/core";
import { InvoiceItem, Purchase } from "src/app/core/models/purchase.model";
import { PeopleService } from "src/app/core/services/people.service";
import { PlaceService } from "src/app/core/services/place.service";
import { UtilService } from "src/app/core/services/util.service";
import { InvoiceComponent } from "../invoice/invoice.component";

@Component({
  selector: "app-buy",
  templateUrl: "./buy.component.html",
  styleUrls: ["./buy.component.scss"],
})
export class BuyComponent implements OnInit {
  purchase = {
    date: new Date()
  } as Purchase;

  defaultPlace: number;
  constructor(
    public peopleService: PeopleService,
    public placeService: PlaceService,
    public util: UtilService
  ) {
  }

  ngOnInit(): void {
    this.peopleService.getAllSupplier();
    this.placeService.getAllPlace();
  }


  addToPurchaseList(item: InvoiceItem) {
    if(!this.purchase.items) {
      this.purchase.items = [];
    }
    this.purchase.items.push(item);
  }

  selectPlace(place: number) {
    this.defaultPlace = place;
  }

}
