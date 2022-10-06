import Big from "big.js";
import { Payment } from "./payment.model";
import { PurchaseOrderItem } from "./purchase-order-item.model";

export class PurchaseOrder {
    data: Date;
    supplier: number;
    items: PurchaseOrderItem[];
    payments: Payment[];
}

export function parsePurchaseOrderRequest(request: PurchaseOrder): PurchaseOrder {
    request.items.forEach(item => {
        item.cost = new Big(item.cost as string)
        item.quantity = new Big(item.quantity as string)
    })
    return request
}