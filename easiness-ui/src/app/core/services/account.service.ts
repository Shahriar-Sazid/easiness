import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Account } from "../models/account.model";
import { UtilService } from "./util.service";

@Injectable({
  providedIn: "root",
})
export class AccountService {
  accountApi = "api/account";
  accountReportApi = `${this.accountApi}/report`;
  allAccountReportApi = `${this.accountApi}/all`;

  accountRecord: Record<string, Account>
  constructor(private http: HttpClient, private util: UtilService) {}

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
    console.log(this.allAccountReportApi);

    this.http.get<Account[]>(this.allAccountReportApi).subscribe(
      data => {
        this.accountRecord = this.util.convertArrayToObject(data, 'id');
      }
    );
  }
}
