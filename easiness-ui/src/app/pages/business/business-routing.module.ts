import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BuyComponent } from "./buy/buy.component";
import { SellComponent } from "./sell/sell.component";
import { StockComponent } from "./stock/stock.component";

const routes: Routes = [
  {
    path: "buy",
    component: BuyComponent,
  },
  {
    path: "sell",
    component: SellComponent,
  },
  {
    path: "stock",
    component: StockComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessRoutingModule {}
