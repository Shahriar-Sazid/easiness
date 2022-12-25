import { Router, Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { FindTxReq } from "../model/tx.model";
import { dashboardService } from "../service/dashboard.service";

const dashboardRouter: Router = Router();

dashboardRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(StatusCodes.OK).send(await dashboardService.find())
    } catch (e) {
        next(e)
    }
});

export default dashboardRouter