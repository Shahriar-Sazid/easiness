import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UnitData } from '../../models/unit-data.model';
import { UnitService } from '../unit.service';

@Injectable({ providedIn: 'root' })
export class UnitResolver implements Resolve<UnitData> {

  constructor(private unitService: UnitService) {}


  resolve(_route: ActivatedRouteSnapshot): Observable<UnitData> | UnitData {
    return this.unitService.unitData ? this.unitService.unitData : this.unitService.fetchUnitData()
  }
}
