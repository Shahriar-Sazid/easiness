import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UnitData } from '../models/unit-data.model';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UnitService {
  unitUrl = "api/unit/all";
  public unitData: UnitData;
  constructor(private http: HttpClient) {
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

  convert(from: number, to: number, value: number): number {
    let conversions = this.unitData.unitConversionList.filter(el => el.from === from && el.to === to);
    conversions = conversions.sort((a, b) => (a.calStep - b.calStep))
    
    if (!conversions?.length) {
      throw new Error("No valid conversion possible");
    }

    for (const conversion of conversions) {
      switch (conversion.operator) {
        case 'PLUS':
          value = value + conversion.constant
          break;
        case 'MINUS':
          value = value - conversion.constant
          break;
        case 'MULTIPLY':
          value = value * conversion.constant
          break;
        case 'DIVIDE':
          value = value / conversion.constant
          break;
        default:
          break;
      }
    }
    return value;
  }


}

