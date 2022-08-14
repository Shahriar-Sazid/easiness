import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Account, Tx, TxSearchOptions } from "../models/accounting.model";
import { Page } from "../models/page.model";
import { UtilService } from "./util.service";

@Injectable({
  providedIn: "root",
})
export class AccountingService {
  accountApi = "api/account";
  accountReportApi = `${this.accountApi}/report`;
  allAccountApi = `${this.accountApi}/all`;
  txApi = "api/tx";

  accountRecord: Record<string, Account>
  constructor(private http: HttpClient, private util: UtilService) { }

  getAccount(searchOptions: { name: string; contactNo: string; page: number; pageSize: number }): Observable<any> {
    this.util.deepTrim(searchOptions);
    const queryString = this.util.convertObjToQueryString(searchOptions);
    const url = `${this.accountApi}${queryString}`;
    console.log("----------Get Account Url-----------");
    console.log(url);
    return this.http.get(url);
  }

  addAccount(newAccount): Observable<any> {
    this.util.deepTrim(newAccount);
    return this.http.post(this.accountApi, newAccount);
  }

  updateAccount(updatedAccount: Account): Observable<any> {
    console.log(updatedAccount);
    this.util.deepTrim(updatedAccount);
    return this.http.put(this.accountApi, updatedAccount);
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
    const url = `${this.accountReportApi}${queryString}`;
    console.log("----------Get Account Url-----------");
    console.log(url);
    return this.http.get(url, { responseType: "arraybuffer", headers: headers });
  }

  getAllAccount() {
    console.log("----------Get All Account Url-----------");
    console.log(this.allAccountApi);

    return this.http.get<Record<string, Account>>(this.allAccountApi).pipe(
      tap(
        data => {
          this.accountRecord = data;
        }
      )
    );
  }

  searchTx(options: TxSearchOptions): Observable<Page<Tx>> {
      this.util.deepTrim(options);
      const queryString = this.util.convertObjToQueryString(options);
      const url = `${this.txApi}${queryString}`;
      console.log("----------Get tx history Url-----------");
      console.log(url);
      return this.http.get<Page<Tx>>(url);
  }
}
