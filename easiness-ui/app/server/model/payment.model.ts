import * as Big from "big.js";
import { Transform, Type } from "class-transformer";

export class Payment {
    fromAccount: number
    toAccount: number
    @Type(() => Number)
    @Transform(({ value }) => new Big(value), { toClassOnly: true })
    amount: Big
}

export class PaymentTx {
    @Type(() => Payment)
    payments: Payment[]
    peopleId: number
    docId: number
    ref: string
    meta: string
    purpose: string
}