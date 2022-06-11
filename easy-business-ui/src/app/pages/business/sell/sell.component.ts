import { Component, OnInit } from '@angular/core';
import { Document, DocumentItem, Payment } from 'src/app/core/models/purchase.model';
import { BusinessService } from 'src/app/core/services/business.service';
import { PeopleService } from 'src/app/core/services/people.service';
import { PlaceService } from 'src/app/core/services/place.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss']
})
export class SellComponent implements OnInit {

  invoice = {
    date: new Date()
  } as Document;

  defaultPlace: number;
  constructor(
    public peopleService: PeopleService,
    public placeService: PlaceService,
    public util: UtilService,
    private businessSevice: BusinessService
  ) {
  }

  ngOnInit(): void {
    this.peopleService.getAllCustomer();
    this.placeService.getAllPlace();
  }


  addToSalesList(item: DocumentItem) {
    if(!this.invoice.items) {
      this.invoice.items = [];
    }
    this.invoice.items.push(item);
  }

  selectPlace(place: number) {
    this.defaultPlace = place;
  }

  buy(payments: Payment[]) {
    this.businessSevice.sell({ ...this.invoice, payments}).subscribe(
      data => {

      },
      err => {
        
      }
    )
  }

}
