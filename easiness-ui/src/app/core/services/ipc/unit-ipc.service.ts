import { Injectable } from "@angular/core";
import { UnitService } from "../iface/unit.service";
import { UnitData } from "../../models/unit-data.model";
import { from } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class UnitIPCService extends UnitService {
    public unitData: UnitData

    constructor() {
        super()
        if (!this.unitData) {
            this.fetchUnitData()
        }
    }

    fetchUnitData() {
        const res = (window as any).electronAPI.getUnitData() as Promise<UnitData>
        return from(res).pipe(
            tap(
                data => {
                    this.unitData = data
                }
            )
        )
    }
}