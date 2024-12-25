import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DocumentItem } from "../../models/document.model";
import { Page } from "../../models/page.model";
import { Stock } from "../../models/stock.model";

@Injectable()
export abstract class StockService {
  abstract addAsInitialStock(items: DocumentItem[]): Observable<any>;
  abstract getStock(params: any): Observable<Page<Stock>>;
}
