import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { FindPeopleRequest } from "../model/people.model";
import { peopleService } from "../service/people.service";

const peopleRouter: Router = Router();


peopleRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(StatusCodes.CREATED).send(await peopleService.save(req.body));
    } catch (e) {
        next(e)
    }
});


peopleRouter.put('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(StatusCodes.ACCEPTED).send(await peopleService.save(req.body));
    } catch (e) {
        next(e)
    }
});

peopleRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(StatusCodes.OK).send(await peopleService.find({
            name: req.query.name ?? '',
            contactNo: req.params.contactNo ?? '',
            page: req.query.page,
            pageSize: req.query.pageSize
        } as FindPeopleRequest ));
    } catch (e) {
        next(e)
    }
});

peopleRouter.get('/supplier', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(StatusCodes.OK).send(await peopleService.findAllSupplier());
    } catch (e) {
        next(e)
    }
});

peopleRouter.get('/customer', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(StatusCodes.OK).send(await peopleService.findAllCustomer());
    } catch (e) {
        next(e)
    }
});

peopleRouter.get('/all', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(StatusCodes.OK).send(await peopleService.findAll());
    } catch (e) {
        next(e)
    }
});

peopleRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(StatusCodes.OK).send(await peopleService.findById(+req.params.id));
    } catch (e) {
        next(e)
    }
});



export default peopleRouter;