import { IpcMainInvokeEvent } from "electron"
import { Product } from "../entity/product.entity"
import { productService } from "../service/product.service"
import { FindProductRequest, ProductRequest } from "../model/product.model"
import { utils } from "../utils/utils"
import { MoveProductInfo } from "../model/stock.model"
import { plainToInstance } from "class-transformer"
import { stockService } from "../service/stock.service"

export const productHandler = {
    create: async (event: IpcMainInvokeEvent, product: ProductRequest) => {
        const res = await productService.create(product)

        return utils.simpleClone(res)
    },
    update: async (event: IpcMainInvokeEvent, product: Product) => {
        const res = await productService.update(product)

        return utils.simpleClone(res)
    },

    search: async (event: IpcMainInvokeEvent, req: FindProductRequest) => {
        const res = await productService.find({
            name: req.name ?? '',
            type: req.type ?? '',
            brand: req.brand ?? '',
            page: req.page,
            pageSize: req.pageSize
        } as FindProductRequest)

        return utils.simpleClone(res)
    },

    move: async (event: IpcMainInvokeEvent, req: MoveProductInfo[]) => {
        const movReq = plainToInstance(MoveProductInfo, [...req])
        const res = await stockService.move(movReq)

        return utils.simpleClone(res)
    },

}