import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Place } from '../../models/place.model';
import { Page } from '../../models/page.model';
import { UtilService } from '../util.service';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PlaceIPCService {
  placeRecord: Record<string, Place>;

  constructor(private util: UtilService) {
    this.getAllPlace = this.getAllPlace.bind(this);
  }

  getPlace(searchOptions: { name?: string; page?: number; pageSize?: number; }): Observable<Page<Place>> {
    this.util.deepTrim(searchOptions);
    const res = (window as any).electronAPI.getPlace(searchOptions) as Promise<Page<Place>>;
    return from(res);
  }

  getAllPlace(): Observable<Record<string, Place>> {
    const res = (window as any).electronAPI.getAllPlaces() as Promise<Record<string, Place>>;
    return from(res).pipe(
      tap(data => {
        this.placeRecord = data;
      })
    );
  }

  addPlace(place: Place): Observable<any> {
    this.util.deepTrim(place);
    const res = (window as any).electronAPI.addPlace(place) as Promise<any>;
    return from(res);
  }

  updatePlace(updatedPlace: Place): Observable<any> {
    console.log(updatedPlace);
    this.util.deepTrim(updatedPlace);
    const res = (window as any).electronAPI.updatePlace(updatedPlace) as Promise<any>;
    return from(res);
  }
}
