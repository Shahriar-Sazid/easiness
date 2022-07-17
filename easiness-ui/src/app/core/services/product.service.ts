import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UtilService } from "./util.service";
import { Product } from "../models/product.model";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  env = environment;

  productApi = "api/product";
  productReportApi = "api/product/report";
  constructor(private http: HttpClient, private util: UtilService) {}

  getProduct(searchOptions: {
    name: string;
    type: string;
    brand: string;
    page: number;
    pageSize: number;
  }): Observable<any> {
    this.util.deepTrim(searchOptions);
    let queryString = this.util.convertObjToQueryString(searchOptions);
    let url = `${this.productApi}${queryString}`;
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
    let queryString = this.util.convertObjToQueryString(searchOptions);
    let url = `${this.productReportApi}${queryString}`;
    console.log("----------Get Product Url-----------");
    console.log(url);
    return this.http.get(url, { responseType: "arraybuffer", headers: headers });
  }
}
