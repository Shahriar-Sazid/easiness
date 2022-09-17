import { Router, Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { FindAccountRequest } from "../model/account.model";
import { accountService } from "../service/account.service";

const accountRouter: Router = Router();


accountRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(StatusCodes.CREATED).send(await accountService.save(req.body));
    } catch (e) {
        next(e);
    }
});

accountRouter.put('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(StatusCodes.ACCEPTED).send(await accountService.save(req.body));
    } catch (e) {
        next(e)
    }
});

accountRouter.get('/all', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(StatusCodes.OK).send(await accountService.findAll());
    } catch (e) {
        next(e)
    }
});

accountRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(StatusCodes.OK).send(await accountService.find({
            accountName: req.query.accountName ?? '',
            accountNo: req.query.accountNo ?? '',
            holderName: req.query.holderName ?? '',
            page: req.query.page,
            pageSize: req.query.pageSize
        } as FindAccountRequest));
    } catch (e) {
        next(e)
    }
});


export default accountRouter;
