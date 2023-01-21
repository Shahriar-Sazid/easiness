import { plainToInstance } from "class-transformer";
import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { PurchaseOrderItem } from "../model/purchase-order.model";
import { FindStockReq } from "../model/stock.model";
import { stockService } from "../service/stock.service";

const stockRouter: Router = Router();

stockRouter.post('/initial-stock', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const items = plainToInstance(PurchaseOrderItem, req.body as PurchaseOrderItem[])
        return res.status(StatusCodes.CREATED).send(
            stockService.addAsInitialStock(items)
        );
    } catch (e) {
        next(e)
    }
});

stockRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(StatusCodes.OK).send(await stockService.find({
            name: req.query.name ?? '',
            type: req.query.type ?? '',
            brand: req.query.brand ?? '',
            placeId: req.query.placeId ? +req.query.placeId : undefined,
            page: req.query.page,
            pageSize: req.query.pageSize
        } as FindStockReq));
    } catch (e) {
        next(e)
    }
});



export default stockRouter