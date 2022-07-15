import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { People } from 'src/app/core/models/people.model';
import { Document, DocumentOptions } from 'src/app/core/models/document.model';
import { PeopleService } from 'src/app/core/services/people.service';

@Component({
  selector: 'app-document-header',
  templateUrl: './document-header.component.html',
  styleUrls: ['./document-header.component.scss']
})
export class InvoiceHeaderComponent implements OnInit, OnDestroy {
  @Input() viewOptions: DocumentOptions;
  @Input() doc: Document;
  people: People = {} as People;
  constructor(private peopleService: PeopleService) { }

  ngOnDestroy(): void {
    this.peopleService.peopleSelected.unsubscribe();
  }

  ngOnInit(): void {
    this.peopleService.initSupplierSelectedSubject();
    this.peopleService.peopleSelected.subscribe(
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
