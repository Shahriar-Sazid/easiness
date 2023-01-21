import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountResolver } from "src/app/core/services/resolvers/account-resolver.service";
import { PlaceResolver } from "src/app/core/services/resolvers/place-resolver.service";
import { UnitResolver } from "src/app/core/services/resolvers/unit-resolver.service";
import { BuyComponent } from "./buy/buy.component";
import { InitialStockComponent } from "./initial-stock/initial-stock.component";
import { SellComponent } from "./sell/sell.component";
import { StockComponent } from "./stock/stock.component";

const routes: Routes = [
  {
    path: "buy",
    component: BuyComponent,
    resolve: {
      units: UnitResolver,
      place: PlaceResolver,
      account: AccountResolver
    }
  },
  {
    path: "sell",
    component: SellComponent,
    resolve: {
      units: UnitResolver,
      place: PlaceResolver,
      account: AccountResolver
    }
  },
  {
    path: "stock",
    component: StockComponent,
    resolve: {
      units: UnitResolver,
      place: PlaceResolver
    }
  },
  {
    path: "initial-stock",
    component: InitialStockComponent,
    resolve: {
      units: UnitResolver,
      place: PlaceResolver,
      account: AccountResolver
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessRoutingModule { }
