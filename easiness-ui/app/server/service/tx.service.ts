import { Repository } from "typeorm";
import { ds } from "../config/data-source";
import { Tx, TxType } from "../entity/tx.entity";
import { getPage, Pagination } from "../model/page.model";
import { Payment, PaymentTx } from "../model/payment.model";
import { FindTxReq, TxRes } from "../model/tx.model";

const repo = ds.getRepository(Tx)

export const txService = {
    saveTxList: async (repo: Repository<Tx>, paymentTx: PaymentTx) => {
        const txList = []

        for (const payment of paymentTx.payments) {
            txList.push({
                amount: payment.amount,
                fromAccountId: payment.fromAccount,
                toAccountId: payment.toAccount,
                documentId: paymentTx.docId,
                peopleId: paymentTx.peopleId,
                type: getType(payment),
                ref: paymentTx.ref
            } as Tx)
        }

        await repo.createQueryBuilder()
            .insert()
            .into(Tx)
            .values(txList)
            .execute()
    },

    find: async ({ from, to, peopleName, peopleId, type, page, pageSize }: FindTxReq) => {
        const query = repo.createQueryBuilder("t").
            select(["t.id", "t.amount", "t.fromAccountId", "t.toAccountId", "p.id", "p.name",
                "t.documentId", "t.ref", "t.type", "t.meta", "t.description", "t.createdAt"])
            .innerJoin("t.people", "p")
            .where("(:peopleName = '' OR LOWER(p.name) LIKE '%' || :peopleName || '%')", { peopleName })
            .where("(:peopleId IS NULL OR p.id = :peopleId)", { peopleId })
            .andWhere("(:type IS NULL OR t.type = :type)", { type })
            .andWhere("(t.createdAt BETWEEN :from AND :to)", { from, to })
            .orderBy("t.createdAt", "DESC")

        const txList = await getPage(query, { page, pageSize })
        const { content, ...others } = txList

        return {
            ...others,
            content: content.map((tx: Tx) => {
                return {
                    id: tx.id,
                    amount: tx.amount,
                    fromAccountId: tx.fromAccountId,
                    toAccountId: tx.toAccountId,
                    peopleId: tx.peopleId,
                    peopleName: tx.people.name,
                    documentId: tx.documentId,
                    ref: tx.ref,
                    type: tx.type,
                    meta: tx.meta,
                    description: tx.description,
                    date: tx.createdAt,
                } as TxRes
            })
        }
    },
}

function getType(payment: Payment) {
    if (payment.fromAccount && payment.toAccount) {
        return TxType.BANK_TRANSFER
    } else if (payment.fromAccount && !payment.toAccount) {
        return TxType.EXPENSE
    } else if (!payment.fromAccount && payment.toAccount) {
        return TxType.INCOME
    }
}