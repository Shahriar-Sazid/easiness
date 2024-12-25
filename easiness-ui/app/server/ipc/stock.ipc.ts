import { IpcMainInvokeEvent } from "electron";
import { stockService } from "../service/stock.service";
import { utils } from "../utils/utils";
import { PurchaseOrderItem } from "../model/purchase-order.model";
import { FindStockReq } from "../model/stock.model";

export const stockHandler = {
  addAsInitialStock: async (
    event: IpcMainInvokeEvent,
    params: PurchaseOrderItem[]
  ) => {
    console.log("Params received in addAsInitialStock:", params); //
    const res = await stockService.addAsInitialStock(params);
    console.log("Response from stockService.addAsInitialStock:", res); //
    return utils.simpleClone(res);
  },

  search: async (event: IpcMainInvokeEvent, req: FindStockReq) => {
    const res = await stockService.find({
      name: req.name ?? "",
      type: req.type ?? "",
      brand: req.brand ?? "",
      placeId: req.placeId ? +req.placeId : undefined,
      page: req.page,
      pageSize: req.pageSize,
    } as FindStockReq);
    return utils.simpleClone(res);
  },
};
