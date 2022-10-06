import { parsePurchaseOrderRequest, PurchaseOrder } from "../model/purchase-order.model";
import { stockService } from "./stock.service";

export const businessService = {
    purchase: async (req: PurchaseOrder) => {
        req = parsePurchaseOrderRequest(req)
        const stockList = await stockService.storeProduct(req.items)
        return stockList
    },
}