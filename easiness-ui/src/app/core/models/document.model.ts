import { Tx } from "./accounting.model";
import { People } from "./people.model";
import { Product } from "./product.model";
import { Stock } from "./stock.model";

export enum DocumentType {
  PURCHASE_ORDER = 'PURCHASE_ORDER',
  INITIAL_STOCK = 'INITIAL_STOCK',
  INVOICE = 'INVOICE'
}

export type Document = {
  id: number;
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
  name: object
  type: object
  brand: object
  country: object
  size: object
  place: object
  quantity: object
  cost: object
  price: object
  totalCost: object
  totalPrice: object
  availableQty: boolean
  validateQty: boolean
  validateUnit: boolean
  showDocumentHeader: boolean
  theme: {
    bg: string
    text: string
    btn: string
  }
  key: DocumentType
  remainder: string
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
  id: number
  date: Date
  people: People
  type: DocumentType
  total: number
  profit: number
  items: DocumentItemResponse[]
  payments: Tx[]
}

export type DocumentItemResponse = {
  id: number
  documentId: number
  name: string
  type: string
  brand: string
  country: string
  size: string
  preferredUnit: number
  quantity: number
  unit: number
  cost: number
  price: number
  placeId: number
}

export function toDocument(documentRes: DocumentResponse): Document {
  const doc: Document = {
    id: documentRes.id,
    type: documentRes.type,
    date: documentRes.date,
    people: documentRes.people.id,
    items: [],
    payments: [],
  } as Document;

  documentRes.payments.forEach(payment => {
    doc.payments.push({
      fromAccount: payment.fromAccountId,
      toAccount: payment.toAccountId,
      amount: payment.amount,
    } as Payment)
  })

  documentRes.items.forEach(item => {
    if (doc.type === DocumentType.INVOICE) {
      doc.items.push({
        entity: {
          name: item.name,
          type: item.type,
          brand: item.brand,
          country: item.country,
          size: item.size,
          preferredUnit: item.preferredUnit
        } as Stock,
        price: item.price,
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
          preferredUnit: item.preferredUnit
        } as Product,
        cost: item.cost,
        quantity: item.quantity,
        place: item.placeId,
        unit: item.unit,
      } as DocumentItem)
    }
  });


  return doc;
}