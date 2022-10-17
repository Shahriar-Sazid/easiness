import Big from "big.js";
import { ds } from "../config/data-source";
import { Document } from "../entity/document.entity";
import { Stock } from "../entity/stock.entity";
import { DocumentType } from "../entity/document.entity";
import { PurchaseOrder, PurchaseOrderItem } from "../model/purchase-order.model";
import { DocumentItem } from "../entity/document-item.entity";
import { FindDocumentReq } from "../model/document.model";
import { getPage } from "../model/page.model";
import { Invoice, InvoiceItem } from "../model/invoice.model";
import { utils } from "../utils/utils";
import { Repository } from "typeorm";

const repo = ds.getRepository(Document)

export const documentService = {
    savePurchaseOrder: async (repo: Repository<Document>, req: PurchaseOrder, stockList: Stock[]) => {
        let totalCost = new Big(0)

        for (const item of req.items) {
            totalCost = totalCost.add(item.cost.mul(item.quantity))
        }

        const document = {
            peopleId: req.supplier,
            type: DocumentType.PURCHASE_ORDER,
            total: totalCost,
            items: req.items.map(item => toPurchaseOrderItem(item, stockList))
        } as Document

        return await repo.save(document)
    },

    saveInvoice: async (repo: Repository<Document>, req: Invoice, stockList: Stock[]) => {
        let totalPrice = new Big(0)
        for (const item of req.items) {
            totalPrice = totalPrice.add(item.price.mul(item.quantity))
        }

        let totalCost = new Big(0)
        for (const item of req.items) {
            totalCost = totalCost.add(item.cost.mul(item.quantity))
        }

        const stockMap = utils.convertArrayToObject(stockList, (st: Stock) => st.id)

        const document = {
            peopleId: req.customer,
            type: DocumentType.INVOICE,
            total: totalPrice,
            profit: totalPrice.add(utils.negate(totalCost)),
            items: req.items.map(item => toInvoiceItem(item, stockMap))
        } as Document

        return await repo.save(document)
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

function toPurchaseOrderItem(item: PurchaseOrderItem, stockList: Stock[]): DocumentItem {
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

function toInvoiceItem(item: InvoiceItem, stockMap: Record<number, Stock>): DocumentItem {
    return {
        costOrPrice: item.cost,
        quantity: item.quantity,
        unitId: item.unit,
        affectedStockId: item.stock,
        productId: stockMap[item.stock]?.productId
    } as DocumentItem
}