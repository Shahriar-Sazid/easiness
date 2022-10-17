import { ds } from "../config/data-source";
import { Account } from "../entity/account.entity";
import { Document } from "../entity/document.entity";
import { People } from "../entity/people.entity";
import { Stock } from "../entity/stock.entity";
import { Tx } from "../entity/tx.entity";
import { Invoice } from "../model/invoice.model";
import { PaymentTx } from "../model/payment.model";
import { PurchaseOrder } from "../model/purchase-order.model";
import { accountService } from "./account.service";
import { documentService } from "./document.service";
import { peopleService } from "./people.service";
import { stockService } from "./stock.service";
import { txService } from "./tx.service";

export const businessService = {
    purchase: async (req: PurchaseOrder) => {
        await ds.transaction(async (tm) => {
            let stockList = await stockService.storeProduct(tm.getRepository(Stock), req.items)
            const document = await documentService.savePurchaseOrder(tm.getRepository(Document), req, stockList)
            await accountService.updateAccountBalance(tm.getRepository(Account), req.payments)
            await peopleService.updateSupplierBalance(req)
            txService.saveTxList(tm.getRepository(Tx), {
                payments: req.payments,
                docId: document.id,
                peopleId: req.supplier,
            } as PaymentTx)
        })
    },

    sell: async (invoice: Invoice) => {
        await ds.transaction(async (tm) => {
            const stockList = await stockService.sellProduct(tm.getRepository(Stock), invoice.items)
            const document = await documentService.saveInvoice(tm.getRepository(Document), invoice, stockList)
            accountService.updateAccountBalance(tm.getRepository(Account), invoice.payments)
            await peopleService.updateCustomerBalance(tm.getRepository(People), invoice)
            txService.saveTxList(tm.getRepository(Tx), {
                payments: invoice.payments,
                docId: document.id,
                peopleId: invoice.customer,
            } as PaymentTx)
        })
    },

    processPayments: async (paymentTx: PaymentTx) => {
        await ds.transaction(async (tm) => {
            accountService.updateAccountBalance(tm.getRepository(Account), paymentTx.payments)
            const doc = await documentService.getDetails(paymentTx.docId)
            paymentTx.peopleId = doc.peopleId
            peopleService.adjustPayment(tm.getRepository(People), doc.peopleId, paymentTx.payments)
            txService.saveTxList(tm.getRepository(Tx), paymentTx)
        })
    },
}