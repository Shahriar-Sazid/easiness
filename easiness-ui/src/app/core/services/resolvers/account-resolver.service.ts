import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Account } from '../../models/accounting.model';
import { AccountingService } from '../accounting.service';

@Injectable({ providedIn: 'root' })
export class AccountResolver implements Resolve<Record<string, Account>> {

    constructor(private accountingService: AccountingService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Record<string, Account>> | Promise<Record<string, Account>> | Record<string, Account> {
        return this.accountingService.accountRecord ? this.accountingService.accountRecord: this.accountingService.getAllAccount();
    }
}