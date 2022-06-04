import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';
import { Observable } from 'rxjs';
import { Stock } from '../models/stock.model';
import { Page } from '../models/page.model';
import { Document } from '../models/purchase.model';

@Injectable({ providedIn: 'root' })
export class BusinessService {
    private businessApi = 'api/business/'
    private purchaseApi = `${this.businessApi}purchase`
    private stockApi = `${this.businessApi}stock`

    constructor(private http: HttpClient, private util: UtilService) { }

    getStock(params: any): Observable<Page<Stock>> {
        this.util.deepTrim(params);
        return <Observable<Page<Stock>>>this.http.get(this.stockApi, {params});
    }

    buy(purchase: Document): Observable<any> {
        this.util.deepTrim(purchase);
        purchase = this.util.clone(purchase);
        purchase['supplier'] = purchase.people;
        purchase.people = undefined;
        purchase.items.forEach((item) => {
            item['product'] = item.entity.id;
            item.entity = undefined;
            return item;
        })

        return this.http.post(this.purchaseApi, purchase);
    }

}