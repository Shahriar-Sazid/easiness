import { Pipe, PipeTransform } from '@angular/core';
import { TxType } from '../models/accounting.model';

@Pipe({
    name: 'txType'
})
export class TxTypePipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        return `<span class="${TxType[value].class} fw-semibold"> <i class="fas ${TxType[value].icon}"></i> Income </span>`
    }
}