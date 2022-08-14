import { Pipe, PipeTransform } from '@angular/core';
import { PlaceService } from '../services/place.service';

@Pipe({
  name: 'place'
})
export class PlacePipe implements PipeTransform {
  constructor(private placeService: PlaceService) {}

  transform(value: any, ...args: any[]): any {
    if(this.placeService.placeRecord) {
      const foundPlace = this.placeService.placeRecord[value];
      if(foundPlace) {
        return foundPlace.name;
      } else return null;
    }
  }
}
