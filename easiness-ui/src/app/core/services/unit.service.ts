import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { UnitData } from '../models/unit-data.model';
import { UnitService } from './iface/unit.service';

@Injectable()
export class UnitWebService extends UnitService {
  unitUrl = "api/v1/unit/all";
  public unitData: UnitData;
  constructor(private http: HttpClient) {
    super()
    if (!this.unitData) {
      this.fetchUnitData()
    }
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

