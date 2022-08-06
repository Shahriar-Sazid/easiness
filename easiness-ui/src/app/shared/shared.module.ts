import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UIModule } from './ui/ui.module';

import { DirectivesModule } from '../core/directives/directive.module';
import { EmptyPlaceHolderPipe } from '../core/pipes/empty-placeholder.pipe';
import { PlacePipe } from '../core/pipes/place.pipe';
import { UnitPipe } from '../core/pipes/unit.pipe';
import { WidgetModule } from './widget/widget.module';

@NgModule({
  declarations: [
    UnitPipe,
    PlacePipe,
    EmptyPlaceHolderPipe
  ],
  exports: [
    UnitPipe,
    PlacePipe,
    EmptyPlaceHolderPipe,
  ],
  imports: [
    CommonModule,
    UIModule,
    WidgetModule,
    DirectivesModule
  ],
})

export class SharedModule { }
