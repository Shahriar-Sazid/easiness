import { Router, Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { TxType } from "../entity/tx.entity";
import { FindTxReq } from "../model/tx.model";
import { txService } from "../service/tx.service";

const txRouter: Router = Router();

txRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(StatusCodes.OK).send(await txService.find({
            from: req.query.from ? new Date(req.query.from as string) : new Date("2022-01-01"),
            to: req.query.to ? new Date(req.query.to as string) : new Date("2099-01-01"),
            type: req.query.type ? TxType[req.query.type as string] : undefined,
            account: +req.query.account,
            peopleName: req.query.peopleName ?? '',
            peopleId: req.query.peopleId ? +req.query.peopleId : undefined,
            page: +req.query.page,
            pageSize: +req.query.pageSize,
        } as FindTxReq));
    } catch (e) {
        next(e)
    }
});

export default txRouter