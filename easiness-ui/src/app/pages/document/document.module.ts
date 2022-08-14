import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentRoutingModule } from './document-routing.module';
import { DocumentListComponent } from './document-list/document-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from 'src/app/shared/shared.module';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { DocumentComponent } from './document/document.component';
import { DocumentItemComponent } from './document-item/document-item.component';
import { DocumentHeaderComponent } from './document-header/document-header.component';
import { DocumentItemFooterComponent } from './document-item-footer/document-item-footer.component';
import { DocumentItemHeaderComponent } from './document-item-header/document-item-header.component';
import { DocumentViewComponent } from './document-view/document-view.component';
import { DirectivesModule } from 'src/app/core/directives/directive.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';


@NgModule({
  declarations: [
    DocumentListComponent,
    DocumentComponent,
    DocumentItemComponent,
    DocumentHeaderComponent,
    DocumentItemFooterComponent,
    DocumentItemHeaderComponent,
    DocumentViewComponent
  ],
  imports: [
    CommonModule,
    DocumentRoutingModule,
    FormsModule,
    NgbModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    DirectivesModule,
    SharedModule,
    UIModule,
    PipesModule
  ],
  exports: [
    DocumentComponent
  ]
})
export class DocumentModule { }
