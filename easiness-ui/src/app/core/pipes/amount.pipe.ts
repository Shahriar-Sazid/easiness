import { formatCurrency } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'amount',
})
export class AmountPipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        const formattedValue = formatCurrency(value, 'en-IN', '৳ ', 'BDT', '1.2-2');
        if(+value > 0) {
            return `<span class="px-1 border border-success rounded bg-success text-white fs-5" > ${formattedValue} </span>`
        }
        return `<span class="px-1 border border-danger rounded bg-danger text-white fs-5" > ${formattedValue} </span>`
    }
}