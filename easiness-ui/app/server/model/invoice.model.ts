import Big from "big.js";
import { Type } from "class-transformer";
import { ToBig } from "../utils/decorators";
import { Payment } from "./payment.model";


export class Invoice {
    @Type(() => Date)
    date: Date

    customer: number

    @Type(() => InvoiceItem)
    items: InvoiceItem[]

    @Type(() => Payment)
    payments: Payment[]


    totalPrice(): Big {
        let totalPrice = new Big(0)
        for (const item of this.items) {
            totalPrice = totalPrice.add(item.price.mul(item.quantity))
        }

        return totalPrice
    }

    totalCost(): Big {
        let totalCost = new Big(0)
        for (const item of this.items) {
            totalCost = totalCost.add(item.cost.mul(item.quantity))
        }

        return totalCost
    }

    totalPaymentReceived(): Big {
        let totalAmount = new Big(0)
        for (const payment of this.payments) {
            totalAmount = totalAmount.add(payment.amount)
        }

        return totalAmount.abs()
    }

}

export class InvoiceItem {
    stock: number

    @ToBig
    quantity: Big

    unit: number

    @ToBig
    price: Big

    @ToBig
    cost: Big
}