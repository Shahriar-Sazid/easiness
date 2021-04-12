import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbCollapseModule, NgbDatepickerModule, NgbTimepickerModule, NgbDropdownModule, NgbAccordionModule, NgbTooltipModule, NgbButtonsModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClickOutsideModule } from 'ng-click-outside';

import { PagetitleComponent } from './pagetitle/pagetitle.component';
import { LoaderComponent } from './loader/loader.component';
import { SearchOptionsComponent } from './search-options/search-options.component';
import { AddProductComponent } from './add-product/add-product.component';
import { AddPeopleComponent } from './add-people/add-people.component';

@NgModule({
  declarations: [PagetitleComponent, LoaderComponent, SearchOptionsComponent, AddProductComponent, AddPeopleComponent],
  imports: [
    CommonModule,
    ClickOutsideModule,
    ReactiveFormsModule,
    NgbCollapseModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    NgbDropdownModule,
    NgbAccordionModule,
    NgbTooltipModule,
    NgbModule
  ],
  exports: [PagetitleComponent, LoaderComponent, SearchOptionsComponent, AddProductComponent, AddPeopleComponent]
})
export class UIModule { }
