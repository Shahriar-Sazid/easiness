import { Component, Input, OnInit } from '@angular/core';
import { DocumentOptions } from 'src/app/core/models/document.model';

@Component({
  selector: 'app-document-item-header',
  templateUrl: './document-item-header.component.html',
  styleUrls: ['./document-item-header.component.scss']
})
export class DocumentItemHeaderComponent {
  @Input() editPermission: boolean;
  @Input() viewOptions: DocumentOptions;

  display(prop: string) {
    return this.viewOptions[prop]?.show
  }

  col(prop: string) {
    return this.viewOptions[prop]?.show?.col
  }
  

}
