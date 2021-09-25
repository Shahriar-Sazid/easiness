import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModule } from './ui/ui.module';

import { WidgetModule } from './widget/widget.module';
import { OnlyNumber } from '../core/directives/only-number.directive';
import { PhoneNoValidator } from '../core/helpers/validation/custom-validator/phone-no-validator';
import { UnitPipe } from '../core/pipes/unit.pipe';
import { PlacePipe } from '../core/pipes/place.pipe';
import { EmptyPlaceHolderPipe } from '../core/pipes/empty-placeholder.pipe';

@NgModule({
  declarations: [
    OnlyNumber,
    PhoneNoValidator,
    UnitPipe,
    PlacePipe,
    EmptyPlaceHolderPipe
  ],
  exports: [
    OnlyNumber,
    PhoneNoValidator,
    UnitPipe,
    PlacePipe,
    EmptyPlaceHolderPipe
  ],
  imports: [
    CommonModule,
    UIModule,
    WidgetModule
  ],
})

export class SharedModule { }
