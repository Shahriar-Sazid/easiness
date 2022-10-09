import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { DocumentType } from "../entity/document.entity";
import { FindDocumentReq } from "../model/document.model";
import { documentService } from "../service/document.service";

const documentRouter: Router = Router();

documentRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(StatusCodes.OK).send(await documentService.find({
            from: req.query.from ? new Date(req.query.from as string) : new Date("2022-01-01"),
            to: req.query.to ? new Date(req.query.to as string) : new Date("2099-01-01"),
            type: req.query.type ? DocumentType[req.query.type as string] : undefined,
            peopleName: req.query.peopleName ?? ''
        } as FindDocumentReq));
    } catch (e) {
        next(e)
    }
});

documentRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(StatusCodes.OK).send(await documentService.getDetails(+req.params.id));
    } catch (e) {
        next(e)
    }
});

export default documentRouter