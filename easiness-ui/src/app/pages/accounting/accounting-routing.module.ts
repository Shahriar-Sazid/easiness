import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountResolver } from 'src/app/core/services/resolvers/account-resolver.service';
import { PeopleResolver } from 'src/app/core/services/resolvers/people-resolver.service';
import { AccountComponent } from './account/account.component';
import { SaveTxComponent } from './save-tx/save-tx.component';
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
      accounts: AccountResolver,
    }
  },
  {
    path: "tx/save/:type",
    component: SaveTxComponent,
    resolve: {
      accounts: AccountResolver,
      people: PeopleResolver,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
