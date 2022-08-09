import { People } from "./people.model";
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
  fromAccount: number;
  toAccount: number; 
  amount: number;
}

export type DocumentOptions = {
  name: object;
  type: object;
  brand: object;
  country: object;
  size: object;
  place: object;
  quantity: object;
  cost: object;
  price: object;
  totalCost: object;
  totalPrice: object;
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

export type DocumentResponse = {
  id: number;
  date: Date;
  people: People;
  type: DocumentType;
  total: number;
  profit: number;
  items: DocumentItemResponse[]
}

export type DocumentItemResponse = {
  id: number;
  documentId: number;
  name: string;
  type: string;
  brand: string;
  country: string;
  size: string;
  quantity: number;
  unit: number;
  costOrPrice: number;
  place: number;
}

export function toDocument(documentRes: DocumentResponse): Document {
  const doc: Document = {
    type: documentRes.type,
    date: documentRes.date,
    people: documentRes.people.id,
    items: [],
  } as Document;

  documentRes.items.forEach(item => {
    if (doc.type === DocumentType.INVOICE) {
      doc.items.push({
        entity: {
          name: item.name,
          type: item.type,
          brand: item.brand,
          country: item.country,
          size: item.size,
          place: item.place,
        } as Stock,
        price: item.costOrPrice,
        quantity: item.quantity,
        unit: item.unit,
      } as DocumentItem)
    }
    else if (doc.type === DocumentType.PURCHASE_ORDER) {
      doc.items.push({
        entity: {
          name: item.name,
          type: item.type,
          brand: item.brand,
          country: item.country,
          size: item.size,
        } as Product,
        cost: item.costOrPrice,
        quantity: item.quantity,
        place: item.place,
        unit: item.unit,
      } as DocumentItem)
    }
  });


  return doc;
}