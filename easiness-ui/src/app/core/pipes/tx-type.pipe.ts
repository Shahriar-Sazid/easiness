import { Pipe, PipeTransform } from '@angular/core';
import { TxType } from '../models/accounting.model';

@Pipe({
    name: 'txType'
})
export class TxTypePipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        return TxType[value].html;
    }
}