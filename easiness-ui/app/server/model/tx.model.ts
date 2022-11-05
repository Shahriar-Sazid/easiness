import Big from "big.js"
import { Type } from "class-transformer"
import { TxType } from "../entity/tx.entity"

export class FindTxReq {
    @Type(() => Date)
    from: Date

    @Type(() => Date)
    to: Date

    type: TxType
    peopleName: string
    peopleId: number
    account: number
    page: number
    pageSize: number
}


export class TxRes {
    id: number
    amount: Big
    fromAccountId: number
    toAccountId: number
    peopleId: number
    peopleName: string
    documentId: number
    ref: string
    type: TxType
    meta: string
    description: string
    date: Date
}