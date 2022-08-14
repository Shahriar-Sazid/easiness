import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import {
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbTimepickerModule,
  NgbDropdownModule,
  NgbAccordionModule,
  NgbTooltipModule,
  NgbModule,
} from "@ng-bootstrap/ng-bootstrap";

import { PageTitleComponent } from "./page-title/page-title.component";
import { LoaderComponent } from "./loader/loader.component";
import { SearchOptionsComponent } from "./search-options/search-options.component";
import { SaveProductComponent } from "./save-product/save-product.component";
import { SavePeopleComponent } from "./save-people/save-people.component";
import { SaveAccountComponent } from "./save-account/save-account.component";
import { SavePlaceComponent } from "./save-place/save-place.component";
import { DateRangeComponent } from './date-range/date-range.component';
import { MoveProductComponent } from './move-product/move-product.component';
import { InfoBoxComponent } from './info-box/info-box.component';
import { ConfirmPaymentComponent } from "./confirm-payment/confirm-payment.component";
import { PaymentModalComponent } from './payment-modal/payment-modal.component';
import { DirectivesModule } from "src/app/core/directives/directive.module";
import { PipesModule } from "src/app/core/pipes/pipes.module";

@NgModule({
  declarations: [
    PageTitleComponent,
    LoaderComponent,
    SearchOptionsComponent,
    SaveProductComponent,
    SavePeopleComponent,
    SaveAccountComponent,
    SavePlaceComponent,
    DateRangeComponent,
    MoveProductComponent,
    InfoBoxComponent,
    ConfirmPaymentComponent,
    PaymentModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbCollapseModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    NgbDropdownModule,
    NgbAccordionModule,
    NgbTooltipModule,
    NgbModule,
    DirectivesModule,
    PipesModule
  ],
  exports: [
    PageTitleComponent,
    LoaderComponent,
    SearchOptionsComponent,
    SaveProductComponent,
    SavePeopleComponent,
    SaveAccountComponent,
    SavePlaceComponent,
    ConfirmPaymentComponent,
    PaymentModalComponent,
    DateRangeComponent,
    MoveProductComponent,
    InfoBoxComponent,
  ],
})
export class UIModule {}
