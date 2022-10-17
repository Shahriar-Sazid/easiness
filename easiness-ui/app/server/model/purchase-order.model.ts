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

    public totalCost() {
        let totalCost = new Big(0)
        for (const item of this.items) {
            totalCost = totalCost.add(item.cost.mul(item.quantity))
        }

        return totalCost.abs()
    }

    totalPaymentDone(): Big {
        let totalAmount = new Big(0)
        for (const payment of this.payments) {
            totalAmount = totalAmount.add(payment.amount)
        }

        return totalAmount.abs()
    }
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