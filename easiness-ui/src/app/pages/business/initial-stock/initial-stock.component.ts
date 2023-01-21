import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DocumentItem, Payment, Document, DocumentType } from "src/app/core/models/document.model";
import { BusinessService } from "src/app/core/services/business.service";
import { PeopleService } from "src/app/core/services/people.service";
import { PlaceService } from "src/app/core/services/place.service";
import { StockService } from "src/app/core/services/stock.service";
import { UtilService } from "src/app/core/services/util.service";
import { DocumentComponent } from "../../document/document/document.component";

@Component({
  selector: "app-buy",
  templateUrl: "./initial-stock.component.html",
  styleUrls: ["./initial-stock.component.scss"],
})
export class InitialStockComponent implements OnInit {
  @ViewChild('doc') docComp: DocumentComponent;

  purchase = {
    type: DocumentType.INITIAL_STOCK,
    date: new Date()
  } as Document;

  defaultPlace: number;
  constructor(
    public peopleService: PeopleService,
    public placeService: PlaceService,
    public util: UtilService,
    private stockService: StockService
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

  addToStock() {
    this.stockService.addAsInitialStock(this.docComp.document?.items).subscribe(
      data => {
        window.location.reload();
      },
      err => {

      }
    )
  }

}
