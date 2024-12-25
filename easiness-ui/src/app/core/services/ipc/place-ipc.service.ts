import { Injectable } from '@angular/core';
import { PlaceService } from '../place.service';

@Injectable({
  providedIn: 'root'
})
export class PlaceIpcService {
  constructor(private placeService: PlaceService) {}

  getPlace(searchOptions) {
    // IPC logic to get place
    return this.placeService.getPlace(searchOptions);
  }

  getAllPlace() {
    // IPC logic to get all places
    return this.placeService.getAllPlace();
  }

  addPlace(place) {
    // IPC logic to add place
    return this.placeService.addPlace(place);
  }

  updatePlace(updatedPlace) {
    // IPC logic to update place
    return this.placeService.updatePlace(updatedPlace);
  }
}
