import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentRoutingModule } from './document-routing.module';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { InvoiceComponent } from './invoice/invoice.component';


@NgModule({
  declarations: [
    PurchaseOrderComponent,
    InvoiceComponent
  ],
  imports: [
    CommonModule,
    DocumentRoutingModule
  ]
})
export class DocumentModule { }
