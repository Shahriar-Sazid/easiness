import { Injectable } from "@angular/core";
import { Observable, from } from "rxjs";
import { DocumentItem } from "../../models/document.model";
import { Page } from "../../models/page.model";
import { StockService } from "../iface/stock.service";
import { UtilService } from "../util.service";
import { Stock } from "../../models/stock.model";

@Injectable()
export class StockIPCService implements StockService {
  constructor(private util: UtilService) {}

  getStock(params: any): Observable<Page<Stock>> {
    this.util.deepTrim(params);
    params = this.util.removeEmpty(params);
    console.log(params);
    const res = (window as any).electronAPI.searchStock(params) as Promise<
      Page<Stock>
    >;
    return from(res);
  }

  addAsInitialStock(items: DocumentItem[]): Observable<any> {
    items.forEach((item) => {
      item["productId"] = item.entity.id;
      item["preferredUnit"] = item.entity.preferredUnit;
      item["placeId"] = item.place;
      item.place = undefined;
      item.entity = undefined;
    });

    console.log("Prepared items for addAsInitialStock:", items); // Debugging
    const res = (window as any).electronAPI.addAsInitialStock(
      items
    ) as Promise<Stock>;
    return from(res);
  }
}
