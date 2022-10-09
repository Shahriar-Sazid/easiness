import { Type } from "class-transformer";
import { Payment } from "./payment.model";
import { PurchaseOrderItem } from "./purchase-order-item.model";

export class PurchaseOrder {
    @Type(() => Date)
    date: Date;

    supplier: number;

    @Type(() => PurchaseOrderItem)
    items: PurchaseOrderItem[];

    @Type(() => Payment)
    payments: Payment[];
}
