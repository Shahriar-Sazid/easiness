import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'pill',
})
export class PillPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        return `<span class="px-1 border border-success rounded bg-success text-white" > ${value} </span>`
    }
}