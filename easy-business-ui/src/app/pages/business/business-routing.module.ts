import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UnitResolver } from "src/app/core/services/resolvers/unit-resolver.service";
import { BuyComponent } from "./buy/buy.component";
import { ConfirmPaymentComponent } from "./confirm-payment/confirm-payment.component";
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
