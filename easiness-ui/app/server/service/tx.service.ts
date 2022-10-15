import { ds } from "../config/data-source";
import { Tx, TxType } from "../entity/tx.entity";
import { getPage, Pagination } from "../model/page.model";
import { Payment, PaymentTx } from "../model/payment.model";
import { FindTxReq, TxRes } from "../model/tx.model";

const repo = ds.getRepository(Tx)

export const txService = {
    makeTxList: (paymentTx: PaymentTx) => {
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

        return txList
    },

    find: async ({ from, to, peopleName, type, page, pageSize }: FindTxReq) => {
        const query = repo.createQueryBuilder("t").
            select(["t.id", "t.amount", "t.fromAccountId", "t.toAccountId", "p.id", "p.name",
                "t.documentId", "t.ref", "t.type", "t.meta", "t.description", "t.createdAt"])
            .innerJoin("t.people", "p")
            .where("(:name = '' OR LOWER(p.name) LIKE '%' || :name || '%')", { name: peopleName })
            .andWhere("(:type IS NULL OR t.type = :type)", { type })
            .andWhere("(t.createdAt BETWEEN :from AND :to)", { from, to })

        const txList = await getPage(query, { page, pageSize } as Pagination)
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