import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessRoutingModule } from './business-routing.module';
import { BuyComponent } from './buy/buy.component';
import { SellComponent } from './sell/sell.component';
import { ArchwizardModule } from 'angular-archwizard';
import { SharedModule } from 'src/app/shared/shared.module';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductModule } from '../product/product.module';
import { CostingComponent } from './costing/costing.component';
import { BasicInfoComponent } from 'src/app/pages/business/basic-info/basic-info.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { StockComponent } from './stock/stock.component';
import { DocumentModule } from '../document/document.module';
import { DirectivesModule } from 'src/app/core/directives/directive.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';


@NgModule({
  declarations: [
    BuyComponent,
    SellComponent,
    CostingComponent,
    BasicInfoComponent,
    StockComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    BusinessRoutingModule,
    ArchwizardModule,
    SharedModule,
    UIModule,
    DirectivesModule,
    ProductModule,
    DocumentModule,
    PipesModule
  ],
})
export class BusinessModule { }
