import { plainToInstance } from "class-transformer";
import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { PurchaseOrder } from "../model/purchase-order.model";
import { businessService } from "../service/business.service";

const businessRouter: Router = Router();


businessRouter.post('/purchase', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const purchaseReq = plainToInstance(PurchaseOrder, req.body)
        return res.status(StatusCodes.CREATED).send(
            await businessService.purchase(purchaseReq)
        );
    } catch (e) {
        next(e)
    }
});

export default businessRouter;