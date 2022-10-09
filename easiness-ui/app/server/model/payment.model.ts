import Big from "big.js";
import { ToBig } from "../utils/decorators";

export class Payment {
    fromAccount: number
    toAccount: number
    @ToBig
    amount: Big
}

export type PaymentTx = {
    payments: Payment[]
    peopleId: number
    docId: number
    ref: string
    meta: string
    purpose: string
}