import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PlaceResolver } from "src/app/core/services/resolvers/place-resolver.service";
import { UnitResolver } from "src/app/core/services/resolvers/unit-resolver.service";
import { BuyComponent } from "./buy/buy.component";
import { SellComponent } from "./sell/sell.component";
import { StockComponent } from "./stock/stock.component";

const routes: Routes = [
  {
    path: "buy",
    component: BuyComponent,
    resolve: {
      units: UnitResolver,
      place: PlaceResolver
    }
  },
  {
    path: "sell",
    component: SellComponent,
  },
  {
    path: "stock",
    component: StockComponent,
    resolve: {
      units: UnitResolver,
      place: PlaceResolver
    }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessRoutingModule {}
