import { NgModule } from '@angular/core';
import { NgClickOutsideDirective } from 'ng-click-outside2';
import { NumberCommaDirective } from './input-with-comma.directive';
import { OnlyNumber } from './only-number.directive';
import { PhoneNoValidator } from './phone-no-validator';
import { NgxResizeWatcherDirective } from './resize-watch.directive';

@NgModule({
    imports: [
        NgClickOutsideDirective
    ],
    declarations: [
        OnlyNumber,
        NumberCommaDirective,
        PhoneNoValidator,
        NgxResizeWatcherDirective,
    ],
    exports: [
        OnlyNumber,
        NumberCommaDirective,
        PhoneNoValidator,
        NgxResizeWatcherDirective,
        NgClickOutsideDirective
    ],
})
export class DirectivesModule { }