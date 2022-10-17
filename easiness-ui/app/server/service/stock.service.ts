import Big from "big.js";
import { In, Repository } from "typeorm";
import { ds } from "../config/data-source";
import { Stock, uniqueStockCols } from "../entity/stock.entity";
import { InvoiceItem } from "../model/invoice.model";
import { getPage, Pagination } from "../model/page.model";
import { PurchaseOrderItem } from "../model/purchase-order.model";
import { FindStockReq, MoveProductInfo, StockRes } from "../model/stock.model";
import { utils } from "../utils/utils";
import { unitService } from "./unit.service";

export const repo = ds.getRepository(Stock)

export const stockService = {
    storeProduct: async (repo: Repository<Stock>, items: PurchaseOrderItem[]) => {
        let itemMap: { [key: string]: PurchaseOrderItem } = {};
        for (const el of items) {
            const altId = el.getAltId()

            if (!itemMap[altId]) {
                itemMap[altId] = el
            } else {
                const prevItem = itemMap[altId];
                const newCostQty = calculateCostAndQuantity(
                    prevItem.quantity as Big, prevItem.cost as Big, prevItem.unit, el.quantity as Big, el.cost as Big, el.unit)
                prevItem.quantity = newCostQty.newQty
                prevItem.cost = newCostQty.newCost
            }
        }

        items = Object.values(itemMap)
        const stockList = await repo.createQueryBuilder("st")
            .where(`(st.product_id, st.place_id) IN (${getInTuple(items)})`)
            .getMany()

        console.log(stockList);

        const stockMap = utils.convertArrayToObject(stockList, (st: Stock) => st.getAltId())

        const existingItems: PurchaseOrderItem[] = []
        const newItems: PurchaseOrderItem[] = []
        for (const item of items) {
            if (stockMap[item.getAltId()]) {
                existingItems.push(item)
            } else {
                newItems.push(item)
            }
        }

        const updatedStocks = updateExistingStock(stockMap, existingItems);
        const newStocks = addNewStock(newItems);
        const stockColumns = ds.getMetadata(Stock).columns.map(col => col.databaseName)

        await repo.createQueryBuilder()
            .insert()
            .into(Stock)
            .orUpdate(stockColumns, uniqueStockCols.map(col => utils.camelToSnakeCase(col)))
            .values([...updatedStocks, ...newStocks])
            .execute()

        return await repo.createQueryBuilder("st")
            .where(`(st.product_id, st.place_id) IN (${getInTuple(stockList)})`)
            .getMany()

    },

    sellProduct: async (repo: Repository<Stock>, items: InvoiceItem[]) => {
        const stockList = await repo.findBy({ id: In(items.map(item => item.stock)) })
        const stockMap = utils.convertArrayToObject(stockList, (st: Stock) => st.getAltId())

        for (const item of items) {
            const stock = stockMap[item.stock]

            const delQty = convertQty(stock.unitId, item.quantity, item.unit)
            stock.quantity = stock.quantity.add(utils.negate(delQty))
            stock.latestPrice = item.price
        }
        const stockColumns = ds.getMetadata(Stock).columns.map(col => col.databaseName)

        await repo.createQueryBuilder()
            .insert()
            .into(Stock)
            .orUpdate(stockColumns, uniqueStockCols.map(col => utils.camelToSnakeCase(col)))
            .values(stockList)
            .execute()

        return stockList
    },

    find: async ({ name, type, brand, placeId, page, pageSize }: FindStockReq) => {
        const query = repo.createQueryBuilder("st").
            select(["st.id", "pr.id", "pr.name", "pr.type", "pr.brand", "pr.country",
                "pr.size", "pl.name", "pl.id", "st.cost", "st.quantity", "un.name", "un.id"])
            .innerJoin("st.product", "pr")
            .innerJoin("st.place", "pl")
            .innerJoin("st.unit", "un")
            .where("(:name = '' OR LOWER(pr.name) LIKE '%' || :name || '%')", { name })
            .andWhere("(:type = '' OR LOWER(pr.type) LIKE '%' || :type || '%')", { type })
            .andWhere("(:brand = '' OR LOWER(pr.brand) LIKE '%' || :brand || '%')", { brand })
            .andWhere("(:placeId is NULL OR pl.id = :placeId)", { placeId })
            .andWhere("st.quantity > '0'")

        const stocks = await getPage(query, { page, pageSize } as Pagination);
        const { content, ...others } = stocks

        return {
            ...others,
            content: content.map((st: Stock) => {
                return {
                    id: st.id,
                    productId: st.product.id,
                    name: st.product.name,
                    type: st.product.type,
                    brand: st.product.brand,
                    country: st.product.country,
                    size: st.product.size,
                    placeTxt: st.place.name,
                    place: st.place.id,
                    quantity: st.quantity.toNumber(),
                    unitTxt: st.unit.name,
                    unit: st.unit.id,
                    cost: st.cost.toNumber(),
                } as StockRes
            })
        }
    },

    async move(req: MoveProductInfo[]) {
        await ds.transaction(async (tm) => {
            const repo = tm.getRepository(Stock)

            const fromStocks = await repo.findBy({ id: In(req.map(item => item.stockId)) })
            const fromStockMap = utils.convertArrayToObject(fromStocks, (st: Stock) => st.id)

            const purchaseItems: PurchaseOrderItem[] = []

            for (const moveData of req) {
                const stock = fromStockMap[moveData.stockId]

                purchaseItems.push({
                    quantity: moveData.quantity,
                    unit: moveData.unit,
                    placeId: moveData.toPlace,
                    productId: stock.productId,
                    cost: stock.cost
                } as PurchaseOrderItem)

                const delQty = convertQty(stock.unitId, moveData.quantity, moveData.unit)
                stock.quantity = stock.quantity.add(utils.negate(delQty))
            }
            const stockColumns = ds.getMetadata(Stock).columns.map(col => col.databaseName)

            await repo.createQueryBuilder()
                .insert()
                .into(Stock)
                .orUpdate(stockColumns, uniqueStockCols.map(col => utils.camelToSnakeCase(col)))
                .values(fromStocks)
                .execute()

            this.storeProduct(purchaseItems)
        })

    },
}

function updateExistingStock(stockMap: Record<string, Stock>, existingItems: PurchaseOrderItem[]): Stock[] {
    const stockList: Stock[] = []
    for (const item of existingItems) {
        const stock = stockMap[item.getAltId()]

        const newCostQty = calculateCostAndQuantity(stock.quantity, stock.cost, stock.unitId,
            item.quantity as Big, item.cost as Big, item.unit)
        stock.cost = newCostQty.newCost
        stock.quantity = newCostQty.newQty
        stockList.push(stock)
    }
    return stockList
}

function addNewStock(newItems: PurchaseOrderItem[]): Stock[] {
    const stockList: Stock[] = []
    for (const item of newItems) {
        const stock: Stock = {
            productId: item.productId,
            placeId: item.placeId,
            quantity: item.quantity,
            unitId: item.unit,
            cost: item.cost,
        } as Stock

        stockList.push(stock)
    }
    return stockList
}

function calculateCostAndQuantity(prevQty: Big, prevCost: Big, prevUnit: number, qty: Big, cost: Big, unit: number): { newQty: Big; newCost: Big } {
    const newQty = prevQty.add(convertQty(prevUnit, qty, unit))
    const newCost = ((prevCost.mul(prevQty)).add((cost.mul(qty)))).div(prevQty.add(qty))
    return { newQty, newCost }
}

function convertQty(prevUnit: number, qty: Big, unit: number): Big {
    return prevUnit.toString() === unit.toString() ? qty : unitService.convert(unit, prevUnit, qty)
}

function getInTuple(items: { productId: number; placeId: number; }[]): string {
    return items.map(el => `(${el.productId}, ${el.placeId})`).join(",")
}