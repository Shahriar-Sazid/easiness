import { Payment } from "./document.model"

export type PaymentTx = {
    payments: Payment[]
    peopleId: number
    docId: number
    ref: string
    meta: string
    purpose: string
}