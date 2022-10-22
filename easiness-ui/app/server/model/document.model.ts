import Big from "big.js";
import { Type } from "class-transformer";
import { DocumentType } from "../entity/document.entity";

export class FindDocumentReq {
    @Type(() => Date)
    from: Date

    @Type(() => Date)
    to: Date

    type: DocumentType
    peopleName: string
    page: number | string
    pageSize: number | string
}

export class DocumentRes {
    id: number
    date: Date
    peopleName: string
    documentType: DocumentType
    total: Big
    profit: Big
}