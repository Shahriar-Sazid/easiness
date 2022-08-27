import { Injectable } from "@angular/core";
import { APP_CONFIG } from "src/environments/environment";
import { Observable, Subject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UtilService } from "./util.service";
import { People } from "../models/people.model";
import { map, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class PeopleService {
  env = APP_CONFIG;

  customerRecord: Record<number, People>;
  supplierRecord: Record<number, People>;
  peopleRecord: Record<number, People>;

  public peopleSelected;

  peopleUrl = "api/people/";
  peopleReportUrl = `${this.peopleUrl}report`;
  allCustomerUrl = `${this.peopleUrl}customer`;
  allSupplierUrl = `${this.peopleUrl}supplier`;
  allPeopleUrl = `${this.peopleUrl}all`;
  peopleByIdUrl = `${this.peopleUrl}id`;
  constructor(private http: HttpClient, private util: UtilService) {
    this.getAllSupplier = this.getAllSupplier.bind(this);
    this.getAllCustomer = this.getAllCustomer.bind(this);
  }

  getPeople(searchOptions: { name: string; contactNo: string; page: number; pageSize: number }): Observable<any> {
    this.util.deepTrim(searchOptions);
    let queryString = this.util.convertObjToQueryString(searchOptions);
    let url = `${this.peopleUrl}${queryString}`;
    console.log("----------Get People Url-----------");
    console.log(url);
    return this.http.get(url);
  }

  addPeople(newPeople): Observable<any> {
    this.util.deepTrim(newPeople);
    return this.http.post(this.peopleUrl, newPeople);
  }

  updatePeople(updatedPeople: People): Observable<any> {
    console.log(updatedPeople);
    this.util.deepTrim(updatedPeople);
    return this.http.put(this.peopleUrl, updatedPeople);
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
    let url = `${this.peopleReportUrl}${queryString}`;
    console.log("----------People Report Url-----------");
    console.log(url);
    return this.http.get(url, { responseType: "arraybuffer", headers: headers });
  }


  getAllCustomer() {
    console.log("----------Get All Customer Url-----------");
    console.log(this.allCustomerUrl);
    this.http.get<People[]>(this.allCustomerUrl).subscribe(
      data => {
        this.customerRecord = this.util.convertArrayToObject(data, 'id');
      }
    );
  }

  getAllSupplier() {
    console.log("----------Get All Supplier Url-----------");
    console.log(this.allSupplierUrl);
    this.http.get<People[]>(this.allSupplierUrl).subscribe(
      data => {
        this.supplierRecord = this.util.convertArrayToObject(data, 'id');
      }
    );
  }

  getAllPeople() {
    return this.http.get<People[]>(this.allPeopleUrl).pipe(
      tap(
        data => {
          this.peopleRecord = this.util.convertArrayToObject(data, 'id');
          this.customerRecord = this.util.convertArrayToObject(data.filter(el => el.type !== 'SUPPLIER'), 'id')
          this.supplierRecord = this.util.convertArrayToObject(data.filter(el => el.type !== 'CUSTOMER'), 'id')
        }
      ),
      map(
        data =>
          this.util.convertArrayToObject(data, 'id')
      )
    );
  }

  getPeopleById(id: number) {
    console.log(`People Id: ${id}`);
    let queryString = this.util.convertObjToQueryString({ id });
    return this.http.get<People>(this.peopleByIdUrl + queryString);
  }

  initSupplierSelectedSubject() {
    this.peopleSelected = new Subject<string>();
  }

  onPeopleSelect(value: string) {
    this.peopleSelected.next(value);
  }

}
