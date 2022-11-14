import { plainToInstance } from "class-transformer";
import { Router, Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { FindProductRequest } from "../model/product.model";
import { MoveProductInfo } from "../model/stock.model";
import { productService } from "../service/product.service";
import { stockService } from "../service/stock.service";

const productRouter: Router = Router();

productRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(StatusCodes.OK).send(await productService.find({
            name: req.query.name ?? '',
            type: req.query.type ?? '',
            brand: req.query.brand ?? '',
            page: req.query.page,
            pageSize: req.query.pageSize
        } as FindProductRequest));
    } catch (e) {
        next(e)
    }
});

productRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(StatusCodes.CREATED).send(await productService.create(req.body));
    } catch (e) {
        next(e)
    }
});

productRouter.put('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(StatusCodes.OK).send(await productService.update(req.body));
    } catch (e) {
        next(e)
    }
});

productRouter.post('/move', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const movReq = plainToInstance(MoveProductInfo, [...req.body])
        return res.status(StatusCodes.OK).send(await stockService.move(movReq));
    } catch (e) {
        next(e)
    }
});

export default productRouter;