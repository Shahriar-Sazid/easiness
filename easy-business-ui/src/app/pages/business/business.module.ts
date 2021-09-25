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
import { InvoiceItemComponent } from './invoice-item/invoice-item.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UnitPipe } from 'src/app/core/pipes/unit.pipe';
import { PlacePipe } from 'src/app/core/pipes/place.pipe';
import { OnlyNumber } from 'src/app/core/directives/only-number.directive';
import { PhoneNoValidator } from 'src/app/core/helpers/validation/custom-validator/phone-no-validator';
import { InvoiceComponent } from './invoice/invoice.component';
import { InvoiceItemHeaderComponent } from './invoice-item-header/invoice-item-header.component';
import { InvoiceHeaderComponent } from './invoice-header/invoice-header.component';
import { InvoiceItemFooterComponent } from './invoice-item-footer/invoice-item-footer.component';


@NgModule({
  declarations: [
    BuyComponent,
    SellComponent,
    CostingComponent,
    BasicInfoComponent,
    InvoiceItemComponent,
    InvoiceComponent,
    InvoiceItemHeaderComponent,
    InvoiceHeaderComponent,
    InvoiceItemFooterComponent,
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
    ProductModule
  ]
})
export class BusinessModule { }
