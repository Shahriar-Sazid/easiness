import { Router, Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { DateRange } from "../model/dashboard.model";
import { FindTxReq } from "../model/tx.model";
import { dashboardService } from "../service/dashboard.service";

const dashboardRouter: Router = Router();

dashboardRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(StatusCodes.OK).send(await dashboardService.find({
            from: req.query.from ? new Date(req.query.from as string) : new Date("2022-01-01"),
            to: req.query.to ? new Date(req.query.to as string) : new Date("2099-01-01"),
        } as DateRange))
    } catch (e) {
        next(e)
    }
});

export default dashboardRouter