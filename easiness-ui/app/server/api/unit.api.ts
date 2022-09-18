import { Router, Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { unitService } from "../service/unit.service";

const unitRouter: Router = Router();

unitRouter.get('/all', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(StatusCodes.OK).send(await unitService.findAll());
    } catch (e) {
        next(e)
    }
});

export default unitRouter