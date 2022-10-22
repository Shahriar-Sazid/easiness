import Big from "big.js";
import { Type } from "class-transformer";
import { ToBig } from "../utils/decorators";

export class Payment {
    fromAccount: number
    toAccount: number
    @ToBig
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