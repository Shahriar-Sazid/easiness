import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgbCollapseModule, NgbDatepickerModule, NgbTimepickerModule, NgbDropdownModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { ClickOutsideModule } from 'ng-click-outside';

import { PagetitleComponent } from './pagetitle/pagetitle.component';
import { LoaderComponent } from './loader/loader.component';
import { SearchOptionsComponent } from './search-options/search-options.component';

@NgModule({
  declarations: [PagetitleComponent, LoaderComponent, SearchOptionsComponent],
  imports: [
    CommonModule,
    ClickOutsideModule,
    NgbCollapseModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    NgbDropdownModule,
    NgbAccordionModule
  ],
  exports: [PagetitleComponent, LoaderComponent, SearchOptionsComponent]
})
export class UIModule { }
