import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Account, Tx, TxSearchOptions } from "../../models/accounting.model";
import { UtilService } from "../util.service";
import { from } from 'rxjs';
import { APP_CONFIG } from "src/environments/environment";
import { Page } from "../../models/page.model";
import { AccountingService } from "../iface/account.service";


@Injectable()
export class AccountingIPCService implements AccountingService {
    accountRecord: Record<string, Account>

    constructor(private util: UtilService) {

    }
    updateAccount(updatedAccount: Account): Observable<any> {
        throw new Error("Method not implemented.");
    }
    getAllAccount(): Observable<any> {
        throw new Error("Method not implemented.");
    }
    searchTx(options: TxSearchOptions): Observable<Page<Tx>> {
        throw new Error("Method not implemented.");
    }
    downloadAsReport(searchOptions: { name: string; type: string; brand: string; page: number; pageSize: number; activeFilters: string; }): Observable<any> {
        throw new Error("Method not implemented.");
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

}
