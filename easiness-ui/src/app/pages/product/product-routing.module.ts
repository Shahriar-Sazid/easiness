import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UnitResolver } from "src/app/core/services/resolvers/unit-resolver.service";
import { ProductComponent } from "./product/product.component";

const routes: Routes = [
  {
    path: "",
    component: ProductComponent,
    resolve: {
      unit: UnitResolver
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule { }
