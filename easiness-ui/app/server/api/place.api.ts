import { Router, Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { placeService } from "../service/place.service";

const placeRouter: Router = Router();


placeRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(StatusCodes.CREATED).send(await placeService.save(req.body));
    } catch (e) {
        next(e)
    }
});

placeRouter.put('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(StatusCodes.ACCEPTED).send(await placeService.save(req.body));
    } catch (e) {
        next(e)
    }
});

placeRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(StatusCodes.OK).send(await placeService.findAll());
    } catch (e) {
        next(e)
    }
});


export default placeRouter;
