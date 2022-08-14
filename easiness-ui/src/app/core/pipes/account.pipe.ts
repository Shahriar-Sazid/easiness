import { Pipe, PipeTransform } from '@angular/core';
import { AccountingService } from '../services/accounting.service';

@Pipe({
    name: 'account'
})
export class AccountPipe implements PipeTransform {
    constructor(private accountingService: AccountingService) { }

    transform(value: any, ...args: string[]): any {
        if(args.length === 0) args = ['accountName'];
        if (this.accountingService.accountRecord) {
            const foundAccount = this.accountingService.accountRecord[value];
            if (foundAccount) {
                return args.map(arg => foundAccount[arg]).filter(el => el).join(",");
            } else return null;
        }
    }
}