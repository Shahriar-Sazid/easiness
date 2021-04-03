import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UtilService } from "./util.service";
import { People } from "../pages/model/people.model";

@Injectable({
  providedIn: "root",
})
export class PeopleService {
  env = environment;

  peopleApi = "api/people";
  peopleReportApi = "api/people/report";
  constructor(private http: HttpClient, private util: UtilService) {}

  getPeople(searchOptions: { name: string; contactNo: string; page: number; pageSize: number }): Observable<any> {
    this.util.deepTrim(searchOptions);
    let queryString = this.util.convertObjToQueryString(searchOptions);
    let url = `${this.peopleApi}${queryString}`;
    console.log("----------Get People Url-----------");
    console.log(url);
    return this.http.get(url);
  }

  addPeople(newPeople): Observable<any> {
    this.util.deepTrim(newPeople);
    return this.http.post(this.peopleApi, newPeople);
  }

  updatePeople(updatedPeople: People): Observable<any> {
    console.log(updatedPeople);
    this.util.deepTrim(updatedPeople);
    return this.http.put(this.peopleApi, updatedPeople);
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
    let url = `${this.peopleReportApi}${queryString}`;
    console.log("----------Get People Url-----------");
    console.log(url);
    return this.http.get(url, { responseType: "arraybuffer", headers: headers });
  }
}
