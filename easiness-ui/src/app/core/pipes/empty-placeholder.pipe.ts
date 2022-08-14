import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'placeholder'
})
export class EmptyPlaceHolderPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if(!value) {
      return args[0];
    } else return value;
  }
}
