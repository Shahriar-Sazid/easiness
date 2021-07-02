import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import {
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbTimepickerModule,
  NgbDropdownModule,
  NgbAccordionModule,
  NgbTooltipModule,
  NgbModule,
} from "@ng-bootstrap/ng-bootstrap";
import { ClickOutsideModule } from "ng-click-outside";

import { PagetitleComponent } from "./pagetitle/pagetitle.component";
import { LoaderComponent } from "./loader/loader.component";
import { SearchOptionsComponent } from "./search-options/search-options.component";
import { SaveProductComponent } from "./save-product/save-product.component";
import { SavePeopleComponent } from "./save-people/save-people.component";
import { SaveAccountComponent } from "./save-account/save-account.component";
import { SavePlaceComponent } from "./save-place/save-place.component";

@NgModule({
  declarations: [
    PagetitleComponent,
    LoaderComponent,
    SearchOptionsComponent,
    SaveProductComponent,
    SavePeopleComponent,
    SaveAccountComponent,
    SavePlaceComponent,
  ],
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
    NgbModule,
  ],
  exports: [
    PagetitleComponent,
    LoaderComponent,
    SearchOptionsComponent,
    SaveProductComponent,
    SavePeopleComponent,
    SaveAccountComponent,
    SavePlaceComponent,
  ],
})
export class UIModule {}
