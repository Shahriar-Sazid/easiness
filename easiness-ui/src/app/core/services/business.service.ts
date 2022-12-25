import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';
import { Observable } from 'rxjs';
import { Stock } from '../models/stock.model';
import { Page } from '../models/page.model';
import { Document, Payment } from '../models/document.model';
import clone from 'just-clone';
import { PaymentTx } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class BusinessService {
    private businessApi = 'api/v1/business/'
    private stockApi = 'api/v1/stock'
    private purchaseApi = `${this.businessApi}purchase`
    private sellApi = `${this.businessApi}sell`
    private paymentApi = `${this.businessApi}payment`

    constructor(private http: HttpClient, private util: UtilService) { }

    getStock(params: any): Observable<Page<Stock>> {
        this.util.deepTrim(params);
        params = this.util.removeEmpty(params);
        return <Observable<Page<Stock>>>this.http.get(this.stockApi, { params });
    }

    buy(purchaseOrder: Document): Observable<any> {
        this.util.deepTrim(purchaseOrder)
        purchaseOrder = clone(purchaseOrder)
        purchaseOrder['supplier'] = purchaseOrder.people
        purchaseOrder.people = undefined
        purchaseOrder.items.forEach((item) => {
            item['productId'] = item.entity.id
            item['preferredUnit'] = item.entity.preferredUnit
            item['placeId'] = item.place
            item.place = undefined
            item.entity = undefined
            return item
        })

        return this.http.post(this.purchaseApi, purchaseOrder)
    }

    sell(invoice: Document): Observable<any> {
        this.util.deepTrim(invoice)
        invoice = clone(invoice)
        invoice['customer'] = invoice.people
        invoice.people = undefined
        invoice.items.forEach((item) => {
            item['stock'] = item.entity.id
            item['preferredUnit'] = item.entity.preferredUnit
            item.cost = item.entity.cost
            return item
        })

        return this.http.post(this.sellApi, invoice);
    }

    processPayment(paymentTx: PaymentTx): Observable<unknown> {
        return this.http.post(this.paymentApi, paymentTx);
    }
}