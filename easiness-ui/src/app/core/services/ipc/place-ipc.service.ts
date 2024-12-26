import { Injectable } from "@angular/core";
import { Place } from "../../models/place.model";
import { from, Observable } from "rxjs";
import { tap, catchError } from "rxjs/operators";

@Injectable()
export class PlaceIpcService {
  placeRecord: Record<string, Place> = {};

  getAllPlace(): Observable<Record<string, Place>> {
    const res = (window as any).electronAPI.findAllPlace() as Promise<
      Record<string, Place>
    >;

    return from(res).pipe(
      tap((data) => {
        this.placeRecord = data;
      }),
      catchError((error) => {
        console.error('Failed to fetch all places:', error);
        throw error;
      })
    );
  }

  addPlace(place: Place): Observable<any> {
    const res = (window as any).electronAPI.createPlace(place);
    return from(res).pipe(
      catchError((error) => {
        console.error('Failed to add place:', error);
        throw error;
      })
    );
  }

  updatePlace(updatedPlace: Place): Observable<any> {
    const res = (window as any).electronAPI.updatePlace(updatedPlace);
    return from(res).pipe(
      catchError((error) => {
        console.error('Failed to update place:', error);
        throw error;
      })
    );
  }
}
