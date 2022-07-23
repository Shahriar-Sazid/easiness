import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { smoothExpandCollapse } from 'src/app/core/animations/animations';
import { Document, DocumentOptions, DocumentResponse, DocumentType, toDocument } from 'src/app/core/models/document.model';
import { People } from 'src/app/core/models/people.model';
import { DocumentService } from 'src/app/core/services/document.service';
import { PlaceService } from 'src/app/core/services/place.service';
import { DocumentItemComponent } from '../document-item/document-item.component';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  animations: [
    smoothExpandCollapse(0, 0, 100)
  ]
})
export class DocumentComponent implements OnInit {
  @Input() mode: DocumentType;
  @ViewChildren(DocumentItemComponent) invCompList: QueryList<DocumentItemComponent>;
  @Input() document: Document;
  viewOptions: DocumentOptions;
  people: People = {} as People;

  constructor(public placeService: PlaceService, private documentService: DocumentService, private route: ActivatedRoute) { }

  getViewOptions(col: number) {
    return {
      show: col ? { col } : undefined
    }
  }

  options = {
    [DocumentType.INVOICE]: {
      name: this.getViewOptions(3),
      type: this.getViewOptions(3),
      brand: this.getViewOptions(2),
      country: this.getViewOptions(2),
      size: this.getViewOptions(2),
      place: this.getViewOptions(undefined),
      quantity: this.getViewOptions(5),
      cost: this.getViewOptions(undefined),
      price: this.getViewOptions(4),
      totalCost: this.getViewOptions(undefined),
      totalPrice: this.getViewOptions(3),
      availableQty: true,
      validateQty: true,
      validateUnit: true,
      theme: {
        bg: 'bg-success',
        text: 'text-success'
      },
      key: DocumentType.INVOICE,
    } as DocumentOptions,
    [DocumentType.PURCHASE_ORDER]: {
      name: this.getViewOptions(3),
      type: this.getViewOptions(3),
      brand: this.getViewOptions(2),
      country: this.getViewOptions(2),
      size: this.getViewOptions(2),
      place: this.getViewOptions(2),
      quantity: this.getViewOptions(3),
      cost: this.getViewOptions(3),
      price: this.getViewOptions(undefined),
      totalCost: this.getViewOptions(4),
      totalPrice: this.getViewOptions(undefined),
      availableQty: false,
      validateQty: false,
      validateUnit: false,
      theme: {
        bg: 'bg-danger',
        text: 'text-danger'
      },
      key: DocumentType.PURCHASE_ORDER,
    } as DocumentOptions,
  }
  editPermission: boolean;

  ngOnInit(): void {
    if (!this.mode && !this.document) {
      this.route.data.subscribe((response: { document: DocumentResponse }) => {
        this.editPermission = false;
        this.people = response.document.people;
        this.document = toDocument(response.document);
        this.mode = this.document.type;
        this.viewOptions = this.options[this.mode]
      });
    } else {
      this.editPermission = true;
      this.viewOptions = this.options[this.mode]
    }
  }

  cancelItem(index: number) {
    this.document.items.splice(index, 1);
  }

  isValid() {
    let valid = true;
    this.invCompList?.forEach(item => {
      valid &&= item.isValid();
    })
    return valid;
  }
}

