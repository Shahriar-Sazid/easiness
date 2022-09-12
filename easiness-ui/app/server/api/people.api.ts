import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { FindPeopleRequest } from "../model/people.model";
import { peopleService } from "../service/people.service";

const peopleRouter: Router = Router();


peopleRouter.post('/', async (req: Request, res: Response) => {
    try {
        return res.status(StatusCodes.CREATED).send(await peopleService.save(req.body));
    } catch (e) {
        res.status(500).send(e.toString());
    }
});


peopleRouter.put('/', async (req: Request, res: Response) => {
    try {
        return res.status(StatusCodes.ACCEPTED).send(await peopleService.save(req.body));
    } catch (e) {
        res.status(500).send(e.toString());
    }
});

peopleRouter.get('/', async (req: Request, res: Response) => {
    try {
        return res.status(StatusCodes.OK).send(await peopleService.find({
            name: req.query.name ?? '',
            contactNo: req.params.contactNo ?? '',
            page: req.query.page,
            pageSize: req.query.pageSize
        } as FindPeopleRequest ));
    } catch (e) {
        res.status(500).send(e.toString());
    }
});

peopleRouter.get('/supplier', async (req: Request, res: Response) => {
    try {
        return res.status(StatusCodes.OK).send(await peopleService.findAllSupplier());
    } catch (e) {
        res.status(500).send(e.toString());
    }
});

peopleRouter.get('/customer', async (req: Request, res: Response) => {
    try {
        return res.status(StatusCodes.OK).send(await peopleService.findAllCustomer());
    } catch (e) {
        res.status(500).send(e.toString());
    }
});

peopleRouter.get('/all', async (req: Request, res: Response) => {
    try {
        return res.status(StatusCodes.OK).send(await peopleService.findAll());
    } catch (e) {
        res.status(500).send(e.toString());
    }
});

peopleRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        return res.status(StatusCodes.OK).send(await peopleService.findById(+req.params.id));
    } catch (e) {
        res.status(500).send(e.toString());
    }
});



export default peopleRouter;