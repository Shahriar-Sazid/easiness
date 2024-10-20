import { Injectable } from "@angular/core";
import { Stock } from "app/server/entity/stock.entity";
import { Observable } from "rxjs";
import { DocumentItem } from "../../models/document.model";
import { Page } from "../../models/page.model";
import { StockService } from "../iface/stock.service";
import { UtilService } from "../util.service";


@Injectable()
export class StockIPCService implements StockService {

    constructor(private util: UtilService) { }
    addAsInitialStock(items: DocumentItem[]): Observable<Stock> {
        throw new Error("Method not implemented.");
    }
    getStock(params: any): Observable<Page<Stock>> {
        throw new Error("Method not implemented.");
    }

}
