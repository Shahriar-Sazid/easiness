import { plainToInstance } from "class-transformer";
import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { Invoice } from "../model/invoice.model";
import { PaymentTx } from "../model/payment.model";
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

businessRouter.post('/sell', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const invoiceReq = plainToInstance(Invoice, req.body)
        return res.status(StatusCodes.CREATED).send(
            await businessService.sell(invoiceReq)
        );
    } catch (e) {
        next(e)
    }
});

businessRouter.post('/payment', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const paymentReq = plainToInstance(PaymentTx, req.body)
        return res.status(StatusCodes.CREATED).send(
            await businessService.processPayments(paymentReq)
        );
    } catch (e) {
        next(e)
    }
});

export default businessRouter;