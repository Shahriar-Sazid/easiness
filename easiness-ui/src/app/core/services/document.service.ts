import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';
import { Observable } from 'rxjs';
import { Page } from '../models/page.model';
import { DocumentSearchRes } from '../models/document.model';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class DocumentService {
    documentApi = "api/document";
    constructor(private http: HttpClient, private util: UtilService) { }

    getDocument(searchOptions: object): Observable<Page<DocumentSearchRes>> {
        this.util.deepTrim(searchOptions);
        let queryString = this.util.convertObjToQueryString(searchOptions);
        let url = `${this.documentApi}${queryString}`;
        console.log("----------Get Document Url-----------");
        console.log(url);
        return this.http.get<Page<DocumentSearchRes>>(url);
    }
}