import Big from "big.js";
import { ds } from "../config/data-source";
import { Document } from "../entity/document.entity";
import { Stock } from "../entity/stock.entity";
import { DocumentType } from "../entity/document.entity";
import { PurchaseOrder } from "../model/purchase-order.model";
import { PurchaseOrderItem } from "../model/purchase-order-item.model";
import { DocumentItem } from "../entity/document-item.entity";
import { ApiError } from "../errors/api-error";

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
    }
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