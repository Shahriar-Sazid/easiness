import { Tx, TxType } from "../entity/tx.entity";
import { Payment, PaymentTx } from "../model/payment.model";

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