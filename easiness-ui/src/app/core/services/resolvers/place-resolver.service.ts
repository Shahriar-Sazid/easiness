import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Place } from '../../models/place.model';
import { PlaceService } from '../place.service';

@Injectable({ providedIn: 'root' })
export class PlaceResolver implements Resolve<Record<string, Place>> {

    constructor(private placeService: PlaceService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Record<string, Place>> | Promise<Record<string, Place>> | Record<string, Place> {
        return this.placeService.placeRecord ? this.placeService.placeRecord: this.placeService.getAllPlace();
    }
}