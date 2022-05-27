import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';
import { Observable } from 'rxjs';
import { Purchase } from '../models/purchase.model';

@Injectable({ providedIn: 'root' })
export class BusinessService {
    private businessApi = 'api/business/'
    private purchaseApi = `${this.businessApi}purchase`

    constructor(private http: HttpClient, private util: UtilService) { }


    buy(purchase: Purchase): Observable<any> {
        this.util.deepTrim(purchase);
        return this.http.post(this.purchaseApi, purchase);
    }

}