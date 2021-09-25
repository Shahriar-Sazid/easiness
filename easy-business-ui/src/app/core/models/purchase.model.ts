import { Product } from "./product.model";

export interface Purchase {
  date: Date;
  supplier: number;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  product: Product;
  place: number;
  quantity: number;
  unit: number;
  cost: number;
}
