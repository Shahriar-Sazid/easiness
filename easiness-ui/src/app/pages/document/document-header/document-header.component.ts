import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { People } from 'src/app/core/models/people.model';
import { Document, DocumentOptions } from 'src/app/core/models/document.model';
import { PeopleService } from 'src/app/core/services/people.service';

@Component({
  selector: 'app-document-header',
  templateUrl: './document-header.component.html',
  styleUrls: ['./document-header.component.scss']
})
export class DocumentHeaderComponent implements OnInit, OnDestroy {
  @Input() viewOptions: DocumentOptions;
  @Input() doc: Document;
  @Input() people: People;
  constructor(private peopleService: PeopleService) { 
    if (!this.people) {
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
    } else {
      this.people = {} as People;
    }
  }

  ngOnDestroy(): void {
    this.peopleService.peopleSelected?.unsubscribe();
  }

  ngOnInit(): void {
    //
  }


}
