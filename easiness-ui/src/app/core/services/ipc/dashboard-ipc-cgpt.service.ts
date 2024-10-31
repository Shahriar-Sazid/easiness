import { Injectable } from "@angular/core";
import { Observable, from } from "rxjs";
import { DashboardResponse } from "../../models/dashboard.model";
import { UtilService } from "../util.service";

@Injectable({ providedIn: "root" })
export class DashboardIPCService {
  constructor(private util: UtilService) {}

  getDashboardData(searchOptions = {}): Observable<DashboardResponse> {
    this.util.deepTrim(searchOptions);
    const res = (window as any).electronAPI.getDashboardData(
      searchOptions
    ) as Promise<DashboardResponse>;
    return from(res);
  }
}
