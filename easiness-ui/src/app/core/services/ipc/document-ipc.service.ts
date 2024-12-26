import { Injectable } from "@angular/core";
import { Observable, from } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class DocumentIpcService {
  
  searchDocument(searchOptions: object): Observable<any> {
    return from((window as any).electronAPI.searchDocument(searchOptions)).pipe(
      catchError(err => {
        console.error("Error in searchDocument IPC call:", err);
        throw err;
      })
    );
  }

  getDocumentById(id: number): Observable<any> {
    return from((window as any).electronAPI.getDocumentById(id)).pipe(
      catchError(err => {
        console.error("Error in getDocumentById IPC call:", err);
        throw err;
      })
    );
  }
}
