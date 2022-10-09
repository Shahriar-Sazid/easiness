import { Router, Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { FindStockReq } from "../model/stock.model";
import { stockService } from "../service/stock.service";

const stockRouter: Router = Router();

stockRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(StatusCodes.OK).send(await stockService.find({
            name: req.query.name ?? '',
            type: req.query.type ?? '',
            brand: req.query.brand ?? '',
            page: req.query.page,
            pageSize: req.query.pageSize
        } as FindStockReq));
    } catch (e) {
        next(e)
    }
});

export default stockRouter