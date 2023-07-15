import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Account, Tx, TxSearchOptions } from "../../models/accounting.model";
import { UtilService } from "../util.service";
import { from } from 'rxjs';
import { APP_CONFIG } from "src/environments/environment";
import { Page } from "../../models/page.model";
import { AccountingService } from "../iface/account.service";
import { tap } from "rxjs/operators";


@Injectable()
export class AccountingIPCService implements AccountingService {
    accountRecord: Record<string, Account>

    constructor(private util: UtilService) {

    }
    addAccount(newAccount: Account): Observable<any> {
        this.util.deepTrim(newAccount)
        const res = (window as any).electronAPI.createAccount(newAccount)
        return from(res)
    }

    getAccount(searchOptions: { name: string; contactNo: string; page: number; pageSize: number }): Observable<Page<Account>> {
        this.util.deepTrim(searchOptions)
        const res = (window as any).electronAPI.searchAccount(searchOptions) as Promise<Page<Account>>
        return from(res)
    }

    updateAccount(updatedAccount: Account): Observable<any> {
        console.log(updatedAccount)
        this.util.deepTrim(updatedAccount)
        const res = (window as any).electronAPI.updateAccount(updatedAccount)
        return from(res)
    }

    getAllAccount(): Observable<any> {
        const res = (window as any).electronAPI.getAllAccount()
        return from(res).pipe(
            tap(
                data => {
                    this.accountRecord = data
                }
            )
        )
    }

    searchTx(options: TxSearchOptions): Observable<Page<Tx>> {
        this.util.deepTrim(options)
        const res = (window as any).electronAPI.searchTx(options) as Promise<Page<Tx>>
        return from(res)
    }

    downloadAsReport(searchOptions: { name: string; type: string; brand: string; page: number; pageSize: number; activeFilters: string; }): Observable<any> {
        throw new Error("Method not implemented.");
    }

}
