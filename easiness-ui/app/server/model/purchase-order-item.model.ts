import Big from "big.js";
import { ToBig } from "../utils/decorators";


export class PurchaseOrderItem {
    productId: number;
    placeId: number;

    @ToBig
    quantity: Big;

    unit: number;

    @ToBig
    cost: Big;

    public getAltId() {
        return `${this.productId}_${this.placeId}`
    }
}