import { Injectable } from "@angular/core";
import { Observable, from } from "rxjs";
import { UtilService } from "../util.service";
import { Page } from "../../models/page.model";
import {
  DocumentResponse,
  DocumentSearchRes,
} from "../../models/document.model";

@Injectable({ providedIn: "root" })
export class DocumentIPCService {
  constructor(private util: UtilService) {}

  searchDocument(searchOptions: object): Observable<Page<DocumentSearchRes>> {
    this.util.deepTrim(searchOptions);
    const res = (window as any).electronAPI.searchDocument(
      searchOptions
    ) as Promise<Page<DocumentSearchRes>>;
    return from(res);
  }

  getDocumentById(id: number): Observable<DocumentResponse> {
    const res = (window as any).electronAPI.getDocumentById(
      id
    ) as Promise<DocumentResponse>;
    return from(res);
  }
}
