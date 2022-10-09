import Big from "big.js";
import { Type } from "class-transformer";
import { ToBig } from "../utils/decorators";
import { Payment } from "./payment.model";

export class PurchaseOrder {
    @Type(() => Date)
    date: Date;

    supplier: number;

    @Type(() => PurchaseOrderItem)
    items: PurchaseOrderItem[];

    @Type(() => Payment)
    payments: Payment[];
}

export class PurchaseOrderItem {
    productId: number;
    placeId: number;

    @ToBig
    quantity: Big;

    unit: number;

    @ToBig
    cost: Big;

    public getAltId() {
        return `${this.productId}_${this.placeId}`
    }
}