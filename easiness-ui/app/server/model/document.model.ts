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