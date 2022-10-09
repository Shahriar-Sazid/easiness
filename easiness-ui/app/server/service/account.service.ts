import Big, { Comparison } from "big.js";
import { In } from "typeorm";
import { ds } from "../config/data-source";
import { Account } from "../entity/account.entity";
import { ApiError } from "../errors/api-error";
import { ReasonCode } from "../errors/codes";
import { FindAccountRequest } from "../model/account.model";
import { getPage, Pagination } from "../model/page.model";
import { Payment } from "../model/payment.model";
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
            .where("(:accountNo = '' OR LOWER(account_no) LIKE '%' || :accountNo || '%')", { accountNo: params.accountNo.toLowerCase() })
            .andWhere("(:accountName = '' OR LOWER(account_name) LIKE '%' || :accountName || '%')", { accountName: params.accountName.toLowerCase() })
            .andWhere("(:holderName = '' OR LOWER(holder_name) LIKE '%' || :holderName || '%')", { holderName: params.holderName.toLowerCase() })

        return getPage(query, params as Pagination);
    },

    updateAccountBalance: async (payments: Payment[]) => {
        if (payments) {
            const ids: number[] = []
            for (const payment of payments) {
                if (payment.fromAccount) {
                    ids.push(payment.fromAccount)
                }
                if (payment.toAccount) {
                    ids.push(payment.toAccount)
                }
            }

            const accounts = await repo.findBy({ id: In(ids) })

            const accountMap = utils.convertArrayToObject(accounts, (account) => account.id)

            for (const payment of payments) {
                if (payment.fromAccount) {
                    const account = accountMap[payment.fromAccount]
                    account.balance = payment.amount.gt(0) ? account.balance.sub(payment.amount) : account.balance.add(payment.amount)
                }
                if (payment.toAccount) {
                    const account = accountMap[payment.toAccount]
                    account.balance = payment.amount.gt(0) ? account.balance.add(payment.amount) : account.balance.sub(payment.amount)
                }
            }

            return accounts
        }
    }
}