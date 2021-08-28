import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModule } from './ui/ui.module';

import { WidgetModule } from './widget/widget.module';
import { OnlyNumber } from '../core/directives/only-number.directive';
import { PhoneNoValidator } from '../core/helpers/validation/custom-validator/phone-no-validator';

@NgModule({
  declarations: [
    OnlyNumber,
    PhoneNoValidator
  ],
  exports: [
    OnlyNumber,
    PhoneNoValidator
  ],
  imports: [
    CommonModule,
    UIModule,
    WidgetModule
  ],
})

export class SharedModule { }
