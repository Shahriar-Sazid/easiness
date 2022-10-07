import { PurchaseOrder } from "../model/purchase-order.model";
import { stockService } from "./stock.service";
import { plainToInstance } from 'class-transformer';

export const businessService = {
    purchase: async (req: PurchaseOrder) => {
        req = plainToInstance(PurchaseOrder, req)

        const stockList = await stockService.storeProduct(req.items)
        return stockList
    },
}