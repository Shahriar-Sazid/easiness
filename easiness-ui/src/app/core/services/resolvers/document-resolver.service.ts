import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DocumentResponse } from '../../models/document.model';
import { DocumentService } from '../document.service';

@Injectable({ providedIn: 'root' })
export class DocumentResolver implements Resolve<DocumentResponse> {

    constructor(private documentService: DocumentService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<DocumentResponse> {
        return this.documentService.getDocumentById(+route.paramMap.get('id'));
    }
}