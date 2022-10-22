import { plainToClass, plainToInstance } from "class-transformer";
import { Router, Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { FindStockReq, MoveProductInfo } from "../model/stock.model";
import { stockService } from "../service/stock.service";

const stockRouter: Router = Router();

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

stockRouter.get('/move', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const movReq = plainToInstance(MoveProductInfo, [...req.body])
        return res.status(StatusCodes.OK).send(await stockService.move(movReq));
    } catch (e) {
        next(e)
    }
});

export default stockRouter