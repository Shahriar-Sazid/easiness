import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product/product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DirectivesModule } from 'src/app/core/directives/directive.module';


@NgModule({
  declarations: [
    ProductComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgbTooltipModule,
    DirectivesModule,
    UIModule
  ],
  exports: [
    ProductComponent
  ]
})
export class ProductModule { }
