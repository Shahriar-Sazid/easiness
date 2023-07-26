import { Injectable } from "@angular/core";
import { PeopleService } from "../iface/people.service";
import { UtilService } from "../util.service";
import { Observable, Subject, from } from "rxjs";
import { Page } from "../../models/page.model";
import { People } from "../../models/people.model";
import { map, tap } from "rxjs/operators";


@Injectable()
export class PeopleIPCService implements PeopleService {
    public peopleSelected;

    customerRecord: Record<number, People>
    supplierRecord: Record<number, People>
    peopleRecord: Record<number, People>

    constructor(private util: UtilService) {
        this.getAllSupplier = this.getAllSupplier.bind(this)
        this.getAllCustomer = this.getAllCustomer.bind(this)
    }

    getPeople(searchOptions: { name: string; contactNo: string; page: number; pageSize: number; }): Observable<Page<People>> {
        this.util.deepTrim(searchOptions)
        const res = (window as any).electronAPI.searchPeople(searchOptions) as Promise<Page<People>>

        return from(res)
    }

    addPeople(newPeople: People): Observable<any> {
        this.util.deepTrim(newPeople)
        const res = (window as any).electronAPI.createPeople(newPeople)

        return from(res)
    }

    updatePeople(updatedPeople: People): Observable<any> {
        this.util.deepTrim(updatedPeople)
        const res = (window as any).electronAPI.updatePeople(updatedPeople)

        return from(res)
    }

    getAllCustomer() {
        (window as any).electronAPI.getAllCustomer().then(data => {
            this.customerRecord = this.util.convertArrayToObject(data, 'id')
        })
    }

    getAllSupplier() {
        (window as any).electronAPI.getAllSupplier().then(data => {
            this.supplierRecord = this.util.convertArrayToObject(data, 'id')
        })
    }

    getAllPeople() {
        const res = (window as any).electronAPI.getAllPeople() as Promise<People[]>
        return from(res).pipe(
            tap(
                data => {
                    this.peopleRecord = this.util.convertArrayToObject(data, 'id');
                    this.customerRecord = this.util.convertArrayToObject(data.filter(el => el.type !== 'SUPPLIER'), 'id')
                    this.supplierRecord = this.util.convertArrayToObject(data.filter(el => el.type !== 'CUSTOMER'), 'id')
                }
            ),
            map(
                data =>
                    this.util.convertArrayToObject(data, 'id')
            )
        )
    }

    getPeopleById(id: number) {
        const res = (window as any).electronAPI.getPeopleDetails(id)

        return from(res)
    }

    initSupplierSelectedSubject() {
        this.peopleSelected = new Subject<string>();

    }
    onPeopleSelect(value: string) {
        this.peopleSelected.next(value);
    }
}
