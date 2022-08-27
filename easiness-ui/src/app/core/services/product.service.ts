import { Injectable } from "@angular/core";
import { APP_CONFIG } from "src/environments/environment";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UtilService } from "./util.service";
import { Product } from "../models/product.model";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  env = APP_CONFIG;

  productApi = "api/product";
  productReportApi = "api/product/report";
  moveProductApi = `${this.productApi}/move`
  constructor(private http: HttpClient, private util: UtilService) {}

  getProduct(searchOptions: {
    name: string;
    type: string;
    brand: string;
    page: number;
    pageSize: number;
  }): Observable<any> {
    this.util.deepTrim(searchOptions);
    const queryString = this.util.convertObjToQueryString(searchOptions);
    const url = `${this.productApi}${queryString}`;
    console.log("----------Get Product Url-----------");
    console.log(url);
    return this.http.get(url);
  }

  addProducts(newProducts): Observable<any> {
    this.util.deepTrim(newProducts);
    return this.http.post(this.productApi, newProducts);
  }

  updateProduct(updatedProduct: Product): Observable<any> {
    this.util.deepTrim(updatedProduct);
    return this.http.put(this.productApi, updatedProduct);
  }

  downloadAsReport(searchOptions: {
    name: string;
    type: string;
    brand: string;
    page: number;
    pageSize: number;
    activeFilters: string;
  }) {
    this.util.deepTrim(searchOptions);
    const headers = new HttpHeaders().set("Content-Type", "application/pdf");
    const queryString = this.util.convertObjToQueryString(searchOptions);
    const url = `${this.productReportApi}${queryString}`;
    console.log("----------Get Product Url-----------");
    console.log(url);
    return this.http.get(url, { responseType: "arraybuffer", headers: headers });
  }

  move(request): Observable<unknown> {
    if (!Array.isArray(request)) {
      request = [request]
    }

    console.log("----------Move Product Url-----------");
    console.log(this.moveProductApi);
    
    return this.http.post(this.moveProductApi, request);
  }
}
