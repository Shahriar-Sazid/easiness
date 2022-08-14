import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeopleRoutingModule } from './people-routing.module';
import { PeopleComponent } from './people/people.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { DirectivesModule } from 'src/app/core/directives/directive.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';


@NgModule({
  declarations: [PeopleComponent],
  imports: [
    CommonModule,
    PeopleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgbTooltipModule,
    UIModule,
    DirectivesModule,
    PipesModule
  ]
})
export class PeopleModule { }
