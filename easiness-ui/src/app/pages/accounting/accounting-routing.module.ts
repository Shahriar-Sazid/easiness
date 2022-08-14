import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountResolver } from 'src/app/core/services/resolvers/account-resolver.service';
import { AccountComponent } from './account/account.component';
import { TxHistoryComponent } from './tx-history/tx-history.component';

const routes: Routes = [
  {
    path: "",
    component: AccountComponent,
  },
  {
    path: "tx/history",
    component: TxHistoryComponent,
    resolve: {
      accounts: AccountResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
