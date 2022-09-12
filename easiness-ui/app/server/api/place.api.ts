import { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { placeService } from "../service/place.service";

const placeRouter: Router = Router();


placeRouter.post('/', async (req: Request, res: Response) => {
    try {
        return res.status(StatusCodes.CREATED).send(await placeService.save(req.body));
    } catch (e) {
        res.status(500).send(e.toString());
    }
});

placeRouter.put('/', async (req: Request, res: Response) => {
    try {
        return res.status(StatusCodes.ACCEPTED).send(await placeService.save(req.body));
    } catch (e) {
        res.status(500).send(e.toString());
    }
});

placeRouter.get('/', async (req: Request, res: Response) => {
    try {
        return res.status(StatusCodes.OK).send(await placeService.findAll());
    } catch (e) {
        res.status(500).send(e.toString());
    }
});


export default placeRouter;
