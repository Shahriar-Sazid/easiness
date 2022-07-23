import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UtilService } from "./util.service";
import { Observable } from "rxjs";
import { Place } from "../models/place.model";
import { Page } from "../models/page.model";
import { tap } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class PlaceService {
  constructor(private http: HttpClient, private util: UtilService) {
    this.getAllPlace = this.getAllPlace.bind(this);
  }

  placeRecord: Record<string, Place>;
  placeUrl = "api/place";
  aLLPlaceUrl = `${this.placeUrl}/all`;

  getPlace(searchOptions: {
    name?: string;
    page?: number;
    pageSize?: number;
  }): Observable<Page<Place>> {
    this.util.deepTrim(searchOptions);
    const queryString = this.util.convertObjToQueryString(searchOptions);
    const url = `${this.placeUrl}${queryString}`;
    console.log("----------Get Place Url-----------");
    console.log(url);
    return this.http.get<Page<Place>>(url);
  }

  getAllPlace() {
    return this.http.get<Record<string, Place>>(this.aLLPlaceUrl).pipe(
      tap(
        data => {
        this.placeRecord = data;
      }
      )
    );
  }

  addPlace(place): Observable<any> {
    this.util.deepTrim(place);
    return this.http.post(this.placeUrl, place);
  }

  updatePlace(updatedPlace: Place): Observable<any> {
    console.log(updatedPlace);
    this.util.deepTrim(updatedPlace);
    return this.http.put(this.placeUrl, updatedPlace);
  }
}
