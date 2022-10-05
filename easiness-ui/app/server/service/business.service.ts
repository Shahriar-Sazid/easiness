import { PurchaseOrder } from "../model/purchase-order.model";
import { stockService } from "./stock.service";

export const businessService = {
    purchase: async (req: PurchaseOrder) => {
       stockService.storeProduct(req.items)
    },
}