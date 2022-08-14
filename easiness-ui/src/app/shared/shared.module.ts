import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DirectivesModule } from '../core/directives/directive.module';
import { WidgetModule } from './widget/widget.module';

@NgModule({
  imports: [
    CommonModule,
    WidgetModule,
    DirectivesModule,
  ],
})

export class SharedModule { }
