import { Pipe, PipeTransform } from '@angular/core';
import { PeopleService } from '../services/people.service';

@Pipe({
    name: 'people'
})
export class PeoplePipe implements PipeTransform {
    constructor(private peopleService: PeopleService) { }

    transform(value: any, ...args: string[]): any {
        if (args.length === 0) args = ['name'];
        if (this.peopleService.peopleRecord) {
            const foundPeople = this.peopleService.peopleRecord[value];
            if (foundPeople) {
                return args.map(arg => foundPeople[arg]).filter(el => el).join(",");
            } else return null;
        }
    }
}