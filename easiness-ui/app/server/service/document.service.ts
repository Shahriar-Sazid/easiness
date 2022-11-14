import Big from "big.js";
import { ds } from "../config/data-source";
import { Document } from "../entity/document.entity";
import { Stock } from "../entity/stock.entity";
import { DocumentType } from "../entity/document.entity";
import { PurchaseOrder, PurchaseOrderItem } from "../model/purchase-order.model";
import { DocumentItem } from "../entity/document-item.entity";
import { DocumentRes, FindDocumentReq } from "../model/document.model";
import { getPage } from "../model/page.model";
import { Invoice, InvoiceItem } from "../model/invoice.model";
import { utils } from "../utils/utils";
import { Repository } from "typeorm";
import { ApiError } from "../errors/api-error";
import { ReasonCode } from "../errors/codes";

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
            select(["dc.id", "dc.createdAt", "pp.name", "dc.type", "dc.total", "dc.profit"])
            .innerJoin("dc.people", "pp")
            .where("(:name = '' OR LOWER(pp.name) LIKE '%' || :name || '%')", { name: peopleName })
            .andWhere("(:type IS NULL OR dc.type = :type)", { type })
            .andWhere("(dc.createdAt BETWEEN :from AND :to)", { from, to })
            .orderBy("dc.createdAt", "DESC")

        const docList = await getPage(query, { page, pageSize })
        const { content, ...others } = docList

        return {
            ...others,
            content: content.map((doc: Document) => {
                return {
                    id: doc.id,
                    date: doc.createdAt,
                    peopleName: doc.people.name,
                    documentType: doc.type,
                    total: doc.total,
                    profit: doc.profit,
                } as DocumentRes
            })
        }
    },

    getDetails: async (id: number, repository: Repository<Document> = repo) => {
        let document: Document;
        try {
            document = await repository.findOneOrFail({
                relations: {
                    people: true,
                    items: {
                        product: true,
                    }
                },
                where: { id }
            })
        } catch (error) {
            throw ApiError.New(ReasonCode.EntityNotFound)
        }


        document['date'] = document.createdAt

        for (const item of document.items) {
            item['name'] = item.product.name
            item['type'] = item.product.type
            item['brand'] = item.product.brand
            item['country'] = item.product.country
            item['size'] = item.product.size
            item['unit'] = item.unitId
            item.product = undefined
        }
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