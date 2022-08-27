import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './accounting-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgbDropdownModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountComponent } from './account/account.component';
import { DirectivesModule } from 'src/app/core/directives/directive.module';
import { TxHistoryComponent } from './tx-history/tx-history.component';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { TxDetailComponent } from './tx-detail/tx-detail.component';
import { SaveTxComponent } from './save-tx/save-tx.component';


@NgModule({
  declarations: [AccountComponent, TxHistoryComponent, TxDetailComponent, SaveTxComponent],
  imports: [
    CommonModule,
    AccountRoutingModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    UIModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbTypeaheadModule,
    DirectivesModule,
    PipesModule
  ],
})
export class AccountingModule { }
