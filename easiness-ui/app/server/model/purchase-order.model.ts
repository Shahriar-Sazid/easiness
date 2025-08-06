import * as Big from "big.js";
import { Transform, Type } from "class-transformer";
import { Payment } from "./payment.model";

export class PurchaseOrder {
    @Type(() => Date)
    date: Date

    supplier: number

    @Type(() => PurchaseOrderItem)
    items: PurchaseOrderItem[]

    @Type(() => Payment)
    payments: Payment[]

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
    productId: number
    placeId: number

    @Type(() => Number)
    @Transform(({ value }) => new Big(value), { toClassOnly: true })
    quantity: Big;

    unit: number
    preferredUnit: number

    @Type(() => Number)
    @Transform(({ value }) => new Big(value), { toClassOnly: true })
    cost: Big

    public getAltId() {
        return `${this.productId}_${this.placeId}`
    }
}