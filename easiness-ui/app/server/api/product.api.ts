import { Router, Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { FindProductRequest } from "../model/product.model";
import { productService } from "../service/product.service";

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

export default productRouter;