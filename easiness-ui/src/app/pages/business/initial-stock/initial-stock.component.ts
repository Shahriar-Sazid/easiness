import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DocumentItem, Payment, Document, DocumentType } from "src/app/core/models/document.model";
import { BusinessService } from "src/app/core/services/business.service";
import { PeopleService } from "src/app/core/services/people.service";
import { PlaceService } from "src/app/core/services/place.service";
import { UtilService } from "src/app/core/services/util.service";

@Component({
  selector: "app-buy",
  templateUrl: "./initial-stock.component.html",
  styleUrls: ["./initial-stock.component.scss"],
})
export class InitialStockComponent implements OnInit {
  purchase = {
    type: DocumentType.PURCHASE_ORDER,
    date: new Date()
  } as Document;

  defaultPlace: number;
  constructor(
    public peopleService: PeopleService,
    public placeService: PlaceService,
    public util: UtilService,
    private businessService: BusinessService
  ) {
  }

  ngOnInit(): void {
    this.peopleService.getAllSupplier();
  }


  addToPurchaseList(item: DocumentItem) {
    if (!this.purchase.items) {
      this.purchase.items = [];
    }
    this.purchase.items.push(item);
  }

  selectPlace(place: number) {
    this.defaultPlace = place;
  }

  buy(payments: Payment[]) {
    this.businessService.buy({ ...this.purchase, payments }).subscribe(
      data => {
        window.location.reload();
      },
      err => {

      }
    )
  }

}
