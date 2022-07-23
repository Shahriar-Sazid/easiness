import { Pipe, PipeTransform } from '@angular/core';
import { UnitService } from '../services/unit.service';

@Pipe({
  name: 'unit'
})
export class UnitPipe implements PipeTransform {

  constructor(private unitService: UnitService) {

  }

  transform(value: number, ...args: unknown[]): string {
    if(this.unitService.unitData) {
      const foundUnit = this.unitService.unitData.unitList.find(unit => unit.id == value);
      if(foundUnit) {
        return foundUnit.name;
      } else return null;
    }
  }
}
