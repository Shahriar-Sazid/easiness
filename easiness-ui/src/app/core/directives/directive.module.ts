import { NgModule } from '@angular/core';
import { OnlyNumber } from './only-number.directive';
import { PhoneNoValidator } from './phone-no-validator';
import { NgxResizeWatcherDirective } from './resize-watch.directive';
import { NumberCommaDirective } from './input-with-comma.directive';

@NgModule({
    imports: [],
    declarations: [
        OnlyNumber,
        NumberCommaDirective,
        PhoneNoValidator,
        NgxResizeWatcherDirective
    ],
    exports: [
        OnlyNumber,
        NumberCommaDirective,
        PhoneNoValidator,
        NgxResizeWatcherDirective
    ],
})
export class DirectivesModule { }