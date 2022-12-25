import Big from "big.js";
import { Transform, Type } from "class-transformer";
import { Pagination } from "./page.model";

export type StockRes = {
    id: number
    productId: number
    name: string
    type: string
    brand: string
    country: string
    preferredUnit: number
    size: string
    placeTxt: string
    place: number
    quantity: number
    unitTxt: string
    unit: number
    cost: number
}

export type FindStockReq = {
    name: string
    type: string
    brand: string
    placeId: number
} & Pagination

export class MoveProductInfo {
    stockId: number
    @Type(() => Number)
    @Transform(({ value }) => new Big(value), { toClassOnly: true })
    quantity: Big
    unit: number
    toPlace: number
}