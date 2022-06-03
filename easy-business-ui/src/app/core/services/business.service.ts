import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';
import { Observable } from 'rxjs';
import { InvoiceItem, Purchase } from '../models/purchase.model';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class BusinessService {
    private businessApi = 'api/business/'
    private purchaseApi = `${this.businessApi}purchase`

    constructor(private http: HttpClient, private util: UtilService) { }


    buy(purchase: any): Observable<any> {
        this.util.deepTrim(purchase);
        purchase = this.util.clone(purchase);
        purchase.items.map((item) => {
            item.product = item.product.id;
            return item;
        })
        // this.util.convertArrayToObject(purchase.items, 'id')


        return this.http.post(this.purchaseApi, purchase);
    }

}