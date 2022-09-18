import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Document, DocumentType } from 'src/app/core/models/document.model';
import { PeopleService } from 'src/app/core/services/people.service';
import { PlaceService } from 'src/app/core/services/place.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent {
  @ViewChild('basicInfoForm', { static: true }) basicInfoForm: NgForm;
  @Input() document: Document;
  @Output() placeSelection: EventEmitter<number> = new EventEmitter();
  defaultPlace: number;
  constructor(public peopleService: PeopleService,
    public placeService: PlaceService,
    public util: UtilService) { }



  selectPlace(defaultPlace: string) {
    this.placeSelection.emit(parseInt(defaultPlace));
  }

}
