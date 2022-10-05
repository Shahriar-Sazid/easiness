import Big from "big.js";
import { ds } from "../config/data-source";
import { Place } from "../entity/place.entity";
import { Product } from "../entity/product.entity";
import { Stock } from "../entity/stock.entity";
import { Unit } from "../entity/unit.entity";
import { PurchaseOrderItem } from "../model/purchase-order-item.model";
import { utils } from "../utils/utils";
import { unitService } from "./unit.service";

export const stockRepo = ds.getRepository(Stock)

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
                    prevItem.quantity, prevItem.cost, prevItem.unit, el.quantity, el.cost, el.unit)
                prevItem.quantity = newCostQty.newQty
                prevItem.cost = newCostQty.newCost
            }
        }

        items = Object.values(itemMap)
        const inTuples = items.map(el => `(${el.product}, ${el.place})`).join(",")
        const stockList = await stockRepo.createQueryBuilder("st")
            .where(`(st.productId, st.placeId) IN (${inTuples})`)
            .getMany()

        console.log(stockList);

        const stockMap = utils.convertArrayToObject(stockList, (st: Stock) => getAltStockId(st))

        const existingItems: PurchaseOrderItem[] = [] 
        const newItems: PurchaseOrderItem[]  = [] 
        for (const item of items) {
            if(stockMap[getAltStockId(item)]) {
                existingItems.push(item)
            } else {
                newItems.push(item)
            }
        }

        const updatedStocks = updateExistingStock(stockMap, existingItems);
        const newStocks = addNewStock(newItems);

        return await stockRepo.createQueryBuilder()
            .insert()
            .into(Stock)
            .values([...updatedStocks, ...newStocks])
            .execute()
    },

}

function updateExistingStock(stockMap: Record<string, Stock>, existingItems: PurchaseOrderItem[]): Stock[] {
    const stockList: Stock[]= [] 
    for (const item of existingItems) {
        const stock = stockMap[getAltStockId(item)]

        const newCostQty = calculateCostAndQuantity(stock.quantity, stock.cost, (stock.unit as Unit).id, item.quantity, item.cost, item.unit)
        stock.cost = newCostQty.newCost
        stock.quantity = newCostQty.newQty
        stockList.push(stock)
    }
    return stockList
}

function addNewStock(newItems: PurchaseOrderItem[]): Stock[] {
    const stockList: Stock[]= [] 
    for (const item of newItems) {
        const stock: Stock = {
            product: { id: item.product} as Product,
            place: { id: item.place} as Place,
            quantity: item.quantity,
            unit: item.unit,
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
    return prevUnit === unit ? qty : unitService.convert(unit, prevUnit, qty)
}

function getAltStockId({ product, place }: { product: number | Product, place: number | Place }): string {
    if (product instanceof Product) {
        if (place instanceof Place) {
            return `${product.id}_${place.id}`
        }
    }
    return `${product}_${place}`
}