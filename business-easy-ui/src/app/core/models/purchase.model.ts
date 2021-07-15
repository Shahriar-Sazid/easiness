import { Product } from "./product.model";

export interface Purchase {
  date: Date;
  supplier: number;
  products: PurchasedProduct[];
}

export interface PurchasedProduct {
  product: Product;
  place: number;
  quantity: number;
  unit: number;
  cost: number;
}
