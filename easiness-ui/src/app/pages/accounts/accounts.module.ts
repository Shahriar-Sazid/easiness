import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountComponent } from './account/account.component';


@NgModule({
  declarations: [AccountComponent],
  imports: [
    CommonModule,
    AccountRoutingModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    UIModule,
    NgbTooltipModule,
  ]
})
export class AccountsModule { }
