import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { FindPeopleRequest } from "../model/people.model";
import { businessService } from "../service/business.service";
import { peopleService } from "../service/people.service";

const businessRouter: Router = Router();


businessRouter.post('/purchase', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(StatusCodes.CREATED).send(await businessService.purchase(req.body));
    } catch (e) {
        next(e)
    }
});

export default businessRouter;