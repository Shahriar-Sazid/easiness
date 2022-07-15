import { Product } from "./product.model";
import { Stock } from "./stock.model";

export enum DocumentType {
  PURCHASE_ORDER = 'PURCHASE_ORDER',
  INVOICE = 'INVOICE'
}

export type Document = {
  type: DocumentType;
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

export type DocumentOptions = {
  name: any;
  type: any;
  brand: any;
  country: any;
  size: any;
  place: any;
  quantity: any;
  cost: any;
  price: any;
  totalCost: any;
  totalPrice: any;
  availableQty: boolean;
  validateQty: boolean;
  validateUnit: boolean;
  theme: {
    bg: string;
    text: string;
  };
  key: DocumentType;
}


export type DocumentSearchRes = {
  id: number;
  type: DocumentType;
  date: string;
  peopleName: string;
  total: string;
  profit: string;
}

export type DateRange = {
  from: Date;
  to: Date;
}