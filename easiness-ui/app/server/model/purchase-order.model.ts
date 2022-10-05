import { Payment } from "./payment.model";
import { PurchaseOrderItem } from "./purchase-order-item.model";

export interface PurchaseOrder {
    data: Date;
    supplier: number;
    items: PurchaseOrderItem[];
    payments: Payment[];
    
}