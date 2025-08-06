import * as Big from "big.js";
import { Type } from "class-transformer";
import { DocumentType } from "../entity/document.entity";
import { DateRange } from "./dashboard.model";

export class FindDocumentReq extends DateRange {
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