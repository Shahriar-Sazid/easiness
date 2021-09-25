import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UnitData } from '../models/unit-data.model';
import { tap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class UnitService {
  unitUrl = "api/unit/all";
  public unitData: UnitData;
  constructor(private http: HttpClient) {
  }

  fetchUnitData() {
    return this.http.get<UnitData>(this.unitUrl).pipe(
      tap((data: UnitData) => {
        console.log("unit data");
        console.log(data);
        this.unitData = data;
      })
    );
  }

}

