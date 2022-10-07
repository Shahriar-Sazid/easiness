import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { businessService } from "../service/business.service";

const businessRouter: Router = Router();


businessRouter.post('/purchase', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(StatusCodes.CREATED).send(await businessService.purchase(req.body));
    } catch (e) {
        next(e)
    }
});

export default businessRouter;