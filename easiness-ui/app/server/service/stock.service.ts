import Big from "big.js";
import { ds } from "../config/data-source";
import { Stock, uniqueStockCols } from "../entity/stock.entity";
import { Unit } from "../entity/unit.entity";
import { PurchaseOrderItem } from "../model/purchase-order-item.model";
import { utils } from "../utils/utils";
import { unitService } from "./unit.service";

export const stockRepo = ds.getRepository(Stock)
// export const stockColumns = ds.getMetadata(Stock).columns.map(col => col.databaseName)

export const stockService = {
    storeProduct: async (items: PurchaseOrderItem[]) => {
        let itemMap: { [key: string]: PurchaseOrderItem } = {};
        for (const el of items) {
            const altId = getAltStockId(el)
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
        const inTuples = items.map(el => `(${el.productId}, ${el.placeId})`).join(",")
        const stockList = await stockRepo.createQueryBuilder("st")
            .where(`(st.product_id, st.place_id) IN (${getInTuple(items)})`)
            .getMany()

        console.log(stockList);

        const stockMap = utils.convertArrayToObject(stockList, (st: Stock) => getAltStockId(st))

        const existingItems: PurchaseOrderItem[] = []
        const newItems: PurchaseOrderItem[] = []
        for (const item of items) {
            if (stockMap[getAltStockId(item)]) {
                existingItems.push(item)
            } else {
                newItems.push(item)
            }
        }

        const updatedStocks = updateExistingStock(stockMap, existingItems);
        const newStocks = addNewStock(newItems);

        const stocksToUpsert = [...updatedStocks, ...newStocks]

        const stockColumns = ds.getMetadata(Stock).columns.map(col => col.databaseName)
        try {
            await stockRepo.createQueryBuilder()
                .insert()
                .into(Stock)
                .orUpdate(stockColumns, uniqueStockCols.map(col => utils.camelToSnakeCase(col)))
                .values(stocksToUpsert)
                .execute()

            return stockRepo.createQueryBuilder("st")
                .where(`(st.product_id, st.place_id) IN (${getInTuple(stocksToUpsert)})`)
                .getMany()
        } catch (error) {
            throw error
        }

    },

}

function updateExistingStock(stockMap: Record<string, Stock>, existingItems: PurchaseOrderItem[]): Stock[] {
    const stockList: Stock[] = []
    for (const item of existingItems) {
        const stock = stockMap[getAltStockId(item)]

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

function getAltStockId({ productId, placeId }: { productId: number, placeId: number }): string {
    return `${productId}_${placeId}`
}

function getInTuple(items: { productId: number; placeId: number; }[]): string {
    return items.map(el => `(${el.productId}, ${el.placeId})`).join(",")
}