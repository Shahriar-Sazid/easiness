import { Injectable } from "@angular/core";
import { Page } from "../../models/page.model";
import { People } from "../../models/people.model";
import { Observable } from "rxjs";

@Injectable()
export abstract class PeopleService {
    customerRecord: Record<number, People>
    supplierRecord: Record<number, People>
    peopleRecord: Record<number, People>

    public peopleSelected

    abstract getPeople(searchOptions: { name: string; contactNo: string; page: number; pageSize: number }): Observable<Page<People>>
    abstract addPeople(newPeople: People): Observable<any>
    abstract updatePeople(updatedPeople: People): Observable<any>
    abstract getAllCustomer()
    abstract getAllSupplier()
    abstract getAllPeople()
    abstract getPeopleById(id: number)
    abstract initSupplierSelectedSubject()
    abstract onPeopleSelect(value: string)
}