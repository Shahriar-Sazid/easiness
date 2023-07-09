import { Account } from "../entity/account.entity";
import { FindAccountRequest } from "../model/account.model";
import { accountService } from "../service/account.service";
import { IpcMainInvokeEvent } from "electron";
import { utils } from "../utils/utils";

export const accountHandler = {
    create: async (event: IpcMainInvokeEvent, account: Account) => {
        const res = await accountService.save(account)
        return res
    },
    search: async (event: IpcMainInvokeEvent, req: FindAccountRequest) => {
        const res = await accountService.find({
            accountName: req.accountName ?? '',
            accountNo: req.accountNo ?? '',
            holderName: req.holderName ?? '',
            page: req.page ?? 1,
            pageSize: req.pageSize ?? 10
        } as FindAccountRequest)
        return utils.simpleClone(res)
    }
}