import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { People } from '../../models/people.model';
import { PeopleService } from '../people.service';

@Injectable({ providedIn: 'root' })
export class PeopleResolver implements Resolve<Record<number, People>> {

    constructor(private peopleService: PeopleService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Record<number, People>> | Promise<Record<number, People>> | Record<number, People> {
        return this.peopleService.peopleRecord ? this.peopleService.peopleRecord: this.peopleService.getAllPeople();
    }
}