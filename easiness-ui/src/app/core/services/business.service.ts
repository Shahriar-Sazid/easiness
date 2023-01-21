import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import clone from 'just-clone';
import { Observable } from 'rxjs';
import { Document } from '../models/document.model';
import { PaymentTx } from '../models/payment.model';
import { UtilService } from './util.service';

@Injectable({ providedIn: 'root' })
export class BusinessService {
    private businessApi = 'api/v1/business/'
    private purchaseApi = `${this.businessApi}purchase`
    private sellApi = `${this.businessApi}sell`
    private paymentApi = `${this.businessApi}payment`

    constructor(private http: HttpClient, private util: UtilService) { }

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