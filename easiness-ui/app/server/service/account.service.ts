import { ds } from "../config/data-source";
import { Account } from "../entity/account.entity";
import { ApiError } from "../errors/api-error";
import { ReasonCode } from "../errors/codes";
import { FindAccountRequest } from "../model/account.model";
import { getPage, Pagination } from "../model/page.model";
import { utils } from "../utils/utils";

const repo = ds.getRepository(Account)

const validateRequest = async ({ id, accountName, accountNo }: Account) => {

    const existing = await repo.find({
        where: [{ id }, { accountName }, { accountNo }],
    })

    if (id) {
        if (existing.filter(el => el.id === id)?.length === 0) {
            throw ApiError.New(ReasonCode.EntityNotFound)
        }
        if (existing.filter(el => (el.id !== id && el.accountName === accountName))?.length > 0) {
            throw ApiError.New(ReasonCode.DupAccountNameFound, `Account already exists with this name: [${accountName}]`)
        }
        if (existing.filter(el => (el.id !== id && el.accountNo === accountNo))?.length > 0) {
            throw ApiError.New(ReasonCode.DupAccountNameFound, `Account already exists with this account no: [${accountNo}]`)
        }
    } else {
        if (existing.filter(el => el.accountName === accountName)?.length > 0) {
            throw ApiError.New(ReasonCode.DupAccountNameFound, `Account already exists with this name: [${accountName}]`)
        }
        if (existing.filter(el => el.accountNo === accountNo)?.length > 0) {
            throw ApiError.New(ReasonCode.DupAccountNameFound, `Account already exists with this account no: [${accountNo}]`)
        }
    }
}

export const accountService = {
    save: async (account: Account) => {
        await validateRequest(account);
        return await repo.save(account)
    },

    findAll: async () => {
        return utils.convertArrayToObject(await repo.find(), account => account.id)
    },

    find: async (params: FindAccountRequest) => {
        const query = repo.createQueryBuilder()
            .where("(:accountNo = '' OR LOWER(accountNo) LIKE '%' || :accountNo || '%')", { accountNo: params.accountNo.toLowerCase() })
            .andWhere("(:accountName = '' OR LOWER(accountName) LIKE '%' || :accountName || '%')", { accountName: params.accountName.toLowerCase() })
            .andWhere("(:holderName = '' OR LOWER(holderName) LIKE '%' || :holderName || '%')", { holderName: params.holderName.toLowerCase() })

        return getPage(query, params as Pagination);
    },
}