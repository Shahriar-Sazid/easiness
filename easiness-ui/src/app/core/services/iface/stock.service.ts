import { Injectable } from "@angular/core";
import { Stock } from "app/server/entity/stock.entity";
import { Observable } from "rxjs";
import { DocumentItem } from "../../models/document.model";
import { Page } from "../../models/page.model";

@Injectable()
export abstract class StockService {
    abstract addAsInitialStock(items: DocumentItem[]): Observable<Stock>
    abstract getStock(params: any): Observable<Page<Stock>>
}