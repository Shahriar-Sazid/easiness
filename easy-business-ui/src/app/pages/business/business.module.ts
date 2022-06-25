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
import { InvoiceItemComponent } from './document-item/document-item.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { InvoiceComponent } from './document/document.component';
import { InvoiceItemHeaderComponent } from './document-item-header/document-item-header.component';
import { InvoiceHeaderComponent } from './document-header/document-header.component';
import { InvoiceItemFooterComponent } from './document-item-footer/document-item-footer.component';
import { ConfirmPaymentComponent } from './confirm-payment/confirm-payment.component';
import { StockComponent } from './stock/stock.component';


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
    ConfirmPaymentComponent,
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
    ProductModule
  ]
})
export class BusinessModule { }
