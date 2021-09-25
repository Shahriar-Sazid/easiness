import { Component, Input, OnInit } from '@angular/core';
import { People } from 'src/app/core/models/people.model';
import { Purchase } from 'src/app/core/models/purchase.model';
import { PeopleService } from 'src/app/core/services/people.service';

@Component({
  selector: 'app-invoice-header',
  templateUrl: './invoice-header.component.html',
  styleUrls: ['./invoice-header.component.scss']
})
export class InvoiceHeaderComponent implements OnInit {
  @Input() purchase: Purchase;
  people: People = {} as People;
  constructor(private peopleService: PeopleService) { }

  ngOnInit(): void {
    this.peopleService.supplierSelected.subscribe(
      res => {
        this.peopleService.getPeopleById(+res).subscribe(
          data => {
            this.people = data;
          }
        )
      }
    )

  }


}
