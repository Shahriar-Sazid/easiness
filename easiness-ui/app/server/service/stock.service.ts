import { plainToInstance } from "class-transformer";
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


        for (const item of items) {
            item.quantity = unitService.convert(+item.unit, +item.preferredUnit, item.quantity)
            // as cost is per unit cost so the conversion is opposite
            item.cost = unitService.convert(+item.preferredUnit, +item.unit, item.cost)
            item.unit = +item.preferredUnit

            const altId = item.getAltId()
            if (itemMap[altId]) {
                const prevItem = itemMap[altId]
                prevItem.cost = ((prevItem.cost.mul(prevItem.quantity)).add((item.cost.mul(item.quantity)))).
                    div(prevItem.quantity.add(item.quantity))
                prevItem.quantity = prevItem.quantity.add(item.quantity)
            } else {
                itemMap[altId] = item
            }
        }

        items = Object.values(itemMap)
        const stockList = await repo.createQueryBuilder("st")
            .where(`(st.product_id, st.place_id) IN (${getInTuple(items)})`)
            .getMany()

        console.log(stockList)

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

    addAsInitialStock: async (items: PurchaseOrderItem[]) => {
        await ds.transaction(async (tm) => {
            return await stockService.storeProduct(tm.getRepository(Stock), items)
        })
    },

    sellProduct: async (repo: Repository<Stock>, items: InvoiceItem[]) => {
        const stockList = await repo.findBy({ id: In(items.map(item => item.stock)) })
        const stockMap = utils.convertArrayToObject(stockList, (st: Stock) => st.id)

        for (const item of items) {
            const stock = stockMap[item.stock]

            const delQty = unitService.convert(item.unit, stock.unitId, item.quantity)
            stock.quantity = stock.quantity.add(utils.negate(delQty))
            stock.latestPrice = item.price
        }

        const stockColumns = ds.getMetadata(Stock).columns.map(col => col.databaseName)

        await repo.createQueryBuilder()
            .insert()
            .into(Stock)
            .orUpdate(stockColumns)
            .values(stockList)
            .updateEntity(false)
            .execute()

        return stockList
    },

    find: async ({ name, type, brand, placeId, page, pageSize }: FindStockReq) => {
        const query = repo.createQueryBuilder("st").
            select(["st.id", "pr.id", "pr.name", "pr.type", "pr.brand", "pr.country", "pr.size",
                "pr.preferredUnit", "pl.name", "pl.id", "st.cost", "st.quantity", "un.name", "un.id"])
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
                    preferredUnit: st.product.preferredUnit,
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
                let item = new PurchaseOrderItem()

                item.quantity = moveData.quantity
                item.unit = moveData.unit
                item.placeId = moveData.toPlace
                item.productId = stock.productId
                item.cost = stock.cost

                purchaseItems.push(item)

                const delQty = unitService.convert(moveData.unit, stock.unitId, moveData.quantity)
                stock.quantity = stock.quantity.add(utils.negate(delQty))
            }
            const stockColumns = ds.getMetadata(Stock).columns.map(col => col.databaseName)

            await repo.createQueryBuilder()
                .insert()
                .into(Stock)
                .orUpdate(stockColumns)
                .values(fromStocks)
                .execute()

            await this.storeProduct(repo, plainToInstance(PurchaseOrderItem, purchaseItems))
        })

    },
}

function updateExistingStock(stockMap: Record<string, Stock>, existingItems: PurchaseOrderItem[]): Stock[] {
    const stockList: Stock[] = []
    for (const item of existingItems) {
        const stock = stockMap[item.getAltId()]

        const newTotalCost = (stock.cost.mul(stock.quantity)).add((item.cost.mul(item.quantity)))
        stock.quantity = stock.quantity.add(item.quantity)
        stock.cost = newTotalCost.div(stock.quantity)

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

function getInTuple(items: { productId: number; placeId: number; }[]): string {
    return items.map(el => `(${el.productId}, ${el.placeId})`).join(",")
}