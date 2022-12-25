import { plainToInstance } from "class-transformer";
import { ds } from "../config/data-source";
import { Account } from "../entity/account.entity";
import { Document } from "../entity/document.entity";
import { People } from "../entity/people.entity";
import { Stock } from "../entity/stock.entity";
import { Tx } from "../entity/tx.entity";
import { Invoice, InvoiceItem } from "../model/invoice.model";
import { PaymentTx } from "../model/payment.model";
import { PurchaseOrder, PurchaseOrderItem } from "../model/purchase-order.model";
import { accountService } from "./account.service";
import { documentService } from "./document.service";
import { peopleService } from "./people.service";
import { stockService } from "./stock.service";
import { txService } from "./tx.service";

export const businessService = {
    purchase: async (req: PurchaseOrder) => {
        await ds.transaction(async (tm) => {
            let stockList = await stockService.storeProduct(tm.getRepository(Stock),
                plainToInstance(PurchaseOrderItem, JSON.parse(JSON.stringify(req.items)) as PurchaseOrderItem[]))
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
            const stockList = await stockService.sellProduct(tm.getRepository(Stock),
                plainToInstance(InvoiceItem, JSON.parse(JSON.stringify(invoice.items)) as InvoiceItem[]))
            const document = await documentService.saveInvoice(tm.getRepository(Document), invoice, stockList)
            await accountService.updateAccountBalance(tm.getRepository(Account), invoice.payments)
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
            try {
                await accountService.updateAccountBalance(tm.getRepository(Account), paymentTx.payments)
                console.log(paymentTx.docId);
                if (paymentTx.docId) {
                    const doc = await documentService.getDetails(paymentTx.docId, tm.getRepository(Document))
                    paymentTx.peopleId = doc.peopleId
                }
                if (paymentTx.peopleId) {
                    await peopleService.adjustPayment(tm.getRepository(People), paymentTx.peopleId, paymentTx.payments)
                }
                await txService.saveTxList(tm.getRepository(Tx), paymentTx)
            } catch (error) {
                throw error
            }

        })
    },
}