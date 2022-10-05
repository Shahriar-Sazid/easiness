import Big from "big.js";

export type PurchaseOrderItem = {
    product: number;
    place: number;
    quantity: Big;
    unit: number;
    cost: Big;
}