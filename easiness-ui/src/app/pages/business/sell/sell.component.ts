import { Component, OnInit } from '@angular/core';
import { Document, DocumentItem, Payment } from 'src/app/core/models/document.model';
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
    type: 'INVOICE',
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
    this.peopleService.getAllCustomer();
    this.placeService.getAllPlace();
  }


  addToSalesList(item: any) {
    if(!this.invoice.items) {
      this.invoice.items = [];
    }
    this.invoice.items.push(item);
  }


  sell(payments: Payment[]) {
    this.businessService.sell({ ...this.invoice, payments}).subscribe(
      data => {
        window.location.reload();
      },
      err => {
        
      }
    )
  }

}
