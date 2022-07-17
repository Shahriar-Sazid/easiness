import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DocumentItem, Payment, Document, DocumentType } from "src/app/core/models/document.model";
import { BusinessService } from "src/app/core/services/business.service";
import { PeopleService } from "src/app/core/services/people.service";
import { PlaceService } from "src/app/core/services/place.service";
import { UtilService } from "src/app/core/services/util.service";

@Component({
  selector: "app-buy",
  templateUrl: "./buy.component.html",
  styleUrls: ["./buy.component.scss"],
})
export class BuyComponent implements OnInit {
  purchase = {
    type: DocumentType.PURCHASE_ORDER,
    date: new Date()
  } as Document;

  defaultPlace: number;
  constructor(
    public peopleService: PeopleService,
    private router: Router,
    public placeService: PlaceService,
    public util: UtilService,
    private businessSevice: BusinessService
  ) {
  }

  ngOnInit(): void {
    this.peopleService.getAllSupplier();
    this.placeService.getAllPlace();
  }


  addToPurchaseList(item: DocumentItem) {
    if(!this.purchase.items) {
      this.purchase.items = [];
    }
    this.purchase.items.push(item);
  }

  selectPlace(place: number) {
    this.defaultPlace = place;
  }

  buy(payments: Payment[]) {
    this.businessSevice.buy({ ...this.purchase, payments}).subscribe(
      data => {
        window.location.reload();
      },
      err => {
        
      }
    )
  }

}
