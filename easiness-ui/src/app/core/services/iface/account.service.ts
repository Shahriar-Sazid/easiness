import { Observable } from "rxjs";
import { Account, Tx, TxSearchOptions } from "../../models/accounting.model";
import { Injectable } from "@angular/core";
import { Page } from "../../models/page.model";


@Injectable()
export abstract class AccountingService {
    accountRecord: Record<string, Account>
    abstract addAccount(newAccount: Account): Observable<any>
    abstract getAccount(searchOptions: { name: string; contactNo: string; page: number; pageSize: number }): Observable<Page<Account>>
    abstract updateAccount(updatedAccount: Account): Observable<any>
    abstract getAllAccount(): Observable<any>
    abstract searchTx(options: TxSearchOptions): Observable<Page<Tx>>
    abstract downloadAsReport(searchOptions: {
        name: string
        type: string
        brand: string
        page: number
        pageSize: number
        activeFilters: string
    }): Observable<any>
}