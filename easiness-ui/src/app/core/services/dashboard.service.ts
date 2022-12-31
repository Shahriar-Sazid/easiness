import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardResponse } from '../models/dashboard.model';
import { UtilService } from './util.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    documentApi = "api/v1/dashboard";
    constructor(private http: HttpClient,
        private util: UtilService) { }

    getDashboardData(searchOptions = {}): Observable<DashboardResponse> {
        this.util.deepTrim(searchOptions);
        const queryString = this.util.convertObjToQueryString(searchOptions);
        const url = `${this.documentApi}${queryString}`;

        return this.http.get<DashboardResponse>(url);
    }

}