import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';
import { Observable } from 'rxjs';
import { Page } from '../models/page.model';
import { Stock } from '../models/stock.model';
import { DocumentItem } from '../models/document.model';

@Injectable({ providedIn: 'root' })
export class StockService {
    constructor(private http: HttpClient,
        private util: UtilService) { }
    private stockApi = 'api/v1/stock'
    private initialStockApi = 'api/v1/stock/initial-stock'

    getStock(params: any): Observable<Page<Stock>> {
        this.util.deepTrim(params);
        params = this.util.removeEmpty(params);
        return <Observable<Page<Stock>>>this.http.get(this.stockApi, { params });
    }

    addAsInitialStock(items: DocumentItem[]): Observable<Stock> {
        items.forEach((item) => {
            item['productId'] = item.entity.id
            item['preferredUnit'] = item.entity.preferredUnit
            item['placeId'] = item.place
            item.place = undefined
            item.entity = undefined
            return item
        })

        return <Observable<Stock>>this.http.post(this.initialStockApi, items)
    }
}