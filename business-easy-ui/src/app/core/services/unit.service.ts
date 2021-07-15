import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UnitData } from '../models/unit-data.model';

@Injectable({providedIn: 'root'})
export class UnitService {
  unitUrl = "api/unit/all";
  public unitData: UnitData;
  constructor(private http: HttpClient) {
    http.get(this.unitUrl).subscribe(
      (data: UnitData) => {
        console.log(data);
        this.unitData = data;
      }
    )
  }

}

