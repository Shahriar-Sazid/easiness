import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';
import { Observable } from 'rxjs';
import { Page } from '../models/page.model';
import { DocumentResponse, DocumentSearchRes } from '../models/document.model';

@Injectable({ providedIn: 'root' })
export class DocumentService {
    documentApi = "api/document";
    constructor(private http: HttpClient, private util: UtilService) { }

    searchDocument(searchOptions: object): Observable<Page<DocumentSearchRes>> {
        this.util.deepTrim(searchOptions);
        const queryString = this.util.convertObjToQueryString(searchOptions);
        const url = `${this.documentApi}${queryString}`;
        console.log("----------Search Document Url-----------");
        console.log(url);
        return this.http.get<Page<DocumentSearchRes>>(url);
    }

    getDocumentById(id: number): Observable<DocumentResponse> {
        const url = `${this.documentApi}/${id}`;

        console.log("----------Get Document Url-----------");
        console.log(url);

        return this.http.get<DocumentResponse>(url);
    }
}