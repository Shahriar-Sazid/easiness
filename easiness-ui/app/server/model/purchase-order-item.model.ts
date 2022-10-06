import Big from "big.js";

export class PurchaseOrderItem {
    productId: number;
    placeId: number;
    quantity: string | Big;
    unit: number;
    cost: string | Big;
}