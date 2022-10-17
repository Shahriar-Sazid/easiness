import Big from "big.js";
import { ToBig } from "../utils/decorators";
import { Pagination } from "./page.model";

export type StockRes = {
    id: number;
    productId: number;
    name: string;
    type: string;
    brand: string;
    country: string;
    size: string;
    placeTxt: string;
    place: number;
    quantity: number;
    unitTxt: string;
    unit: number;
    cost: number;
}

export type FindStockReq = {
    name: string;
    type: string;
    brand: string;
    placeId: number;
} & Pagination


export class MoveProductInfo {
    stockId: number
    @ToBig
    quantity: Big
    unit: number
    toPlace: number
}

