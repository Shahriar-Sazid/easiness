import { Product } from "./product.model";
import { Stock } from "./stock.model";

export interface Document {
  type: 'PURCHASE_ORDER' | 'INVOICE';
  date: Date;
  people: number;
  items: DocumentItem[];
  payments: Payment[];
}

export type DocumentItem = {
  entity: Product & Stock;
  place: number;
  quantity: number;
  unit: number;
  cost: number;
  price: number;
}

export type Payment = {
  targetAccount: number;
  amount: number;
}
