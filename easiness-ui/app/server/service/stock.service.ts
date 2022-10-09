import Big from "big.js";
import { ds } from "../config/data-source";
import { Stock } from "../entity/stock.entity";
import { getPage, Pagination } from "../model/page.model";
import { PurchaseOrderItem } from "../model/purchase-order.model";
import { FindStockReq, StockRes } from "../model/stock.model";
import { utils } from "../utils/utils";
import { unitService } from "./unit.service";

export const repo = ds.getRepository(Stock)

export const stockService = {
    storeProduct: async (items: PurchaseOrderItem[]) => {
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

        return [...updatedStocks, ...newStocks]
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
    }
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