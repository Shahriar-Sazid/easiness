import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModule } from './ui/ui.module';

import { WidgetModule } from './widget/widget.module';
import { OnlyNumber } from '../core/directives/only-number.directive';
import { PhoneNoValidator } from '../core/directives/phone-no-validator';
import { UnitPipe } from '../core/pipes/unit.pipe';
import { PlacePipe } from '../core/pipes/place.pipe';
import { EmptyPlaceHolderPipe } from '../core/pipes/empty-placeholder.pipe';
import { NumberCommaDirective } from '../core/directives/input-with-comma.directive';

@NgModule({
  declarations: [
    OnlyNumber,
    NumberCommaDirective,
    PhoneNoValidator,
    UnitPipe,
    PlacePipe,
    EmptyPlaceHolderPipe
  ],
  exports: [
    OnlyNumber,
    NumberCommaDirective,
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
