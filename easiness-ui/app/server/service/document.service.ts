import Big from "big.js";
import { ds } from "../config/data-source";
import { Document } from "../entity/document.entity";
import { Stock } from "../entity/stock.entity";
import { DocumentType } from "../entity/document.entity";
import { PurchaseOrder, PurchaseOrderItem } from "../model/purchase-order.model";
import { DocumentItem } from "../entity/document-item.entity";
import { FindDocumentReq } from "../model/document.model";
import { getPage } from "../model/page.model";

const repo = ds.getRepository(Document)

export const documentService = {
    makePurchaseDocument: (req: PurchaseOrder, stockList: Stock[]) => {
        let totalCost = new Big(0)

        for (const item of req.items) {
            totalCost = totalCost.add(item.cost)
        }

        return {
            peopleId: req.supplier,
            type: DocumentType.PURCHASE_ORDER,
            total: totalCost,
            items: req.items.map(item => toDocumentItem(item, stockList))
        } as Document
    },

    find: async ({ from, to, peopleName, type, page, pageSize }: FindDocumentReq) => {
        const query = repo.createQueryBuilder("dc").
            select(["dc.id", "dc.created_at", "pp.name", "dc.type", "dc.total", "dc.profit"])
            .innerJoin("dc.people", "pp")
            .where("(:name = '' OR LOWER(pp.name) LIKE '%' || :name || '%')", { name: peopleName })
            .andWhere("(:type IS NULL OR dc.type = :type)", { type })
            .andWhere("(dc.createdAt BETWEEN :from AND :to)", { from, to })

        return getPage(query, { page, pageSize })
    },

    getDetails: async (id: number) => {
        const document = await repo.findOne({
            relations: {
                items: true
            },
            where: { id }
        })
        document['date'] = document.createdAt
        return document
    },
}

function toDocumentItem(item: PurchaseOrderItem, stockList: Stock[]): DocumentItem {
    const docItem = {
        costOrPrice: item.cost,
        placeId: item.placeId,
        quantity: item.quantity,
        unitId: item.unit,
        productId: item.productId
    } as DocumentItem

    for (const stock of stockList) {
        if (stock.getAltId() === item.getAltId()) {
            docItem.affectedStockId = stock.id
        }
    }
    return docItem
}