import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UnitResolver } from "src/app/core/services/resolvers/unit-resolver.service";
import { BuyComponent } from "./buy/buy.component";
import { SellComponent } from "./sell/sell.component";

const routes: Routes = [
  {
    path: "buy",
    component: BuyComponent,
  },
  {
    path: "sell",
    component: SellComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessRoutingModule {}
