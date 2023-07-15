import { IpcMainInvokeEvent } from "electron";
import { FindTxReq } from "../model/tx.model";
import { txService } from "../service/tx.service";
import { TxType } from "../entity/tx.entity";
import { utils } from "../utils/utils";

export const txHandler = {
    search: async (event: IpcMainInvokeEvent, req: FindTxReq) => {
        const res = await txService.find({
            from: req.from ? new Date(req.from) : new Date("2022-01-01"),
            to: req.to ? new Date(req.to) : new Date("2099-01-01"),
            type: req.type ? TxType[req.type as string] : undefined,
            account: req.account ? +req.account : undefined,
            peopleName: req.peopleName ?? '',
            peopleId: req.peopleId ? +req.peopleId : undefined,
            page: +req.page,
            pageSize: +req.pageSize,
        } as FindTxReq)
        return utils.simpleClone(res)
    },

}