import Big from "big.js";
import { Type } from "class-transformer";
import { ToBig } from "../utils/decorators";
import { Payment } from "./payment.model";


export class Invoice {
    @Type(() => Date)
    date: Date

    customer: number

    @Type(() => InvoiceItem)
    items: []

    @Type(() => Payment)
    payments: Payment[]
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