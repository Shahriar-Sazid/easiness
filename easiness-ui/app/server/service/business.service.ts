import { ds } from "../config/data-source";
import { Account } from "../entity/account.entity";
import { Document } from "../entity/document.entity";
import { People } from "../entity/people.entity";
import { Stock, uniqueStockCols } from "../entity/stock.entity";
import { Tx } from "../entity/tx.entity";
import { Invoice } from "../model/invoice.model";
import { PaymentTx } from "../model/payment.model";
import { PurchaseOrder } from "../model/purchase-order.model";
import { utils } from "../utils/utils";
import { accountService } from "./account.service";
import { documentService } from "./document.service";
import { peopleService } from "./people.service";
import { stockService } from "./stock.service";
import { txService } from "./tx.service";

export const businessService = {
    purchase: async (req: PurchaseOrder) => {
        await ds.transaction(async (tm) => {
            let stockList = await stockService.storeProduct(req.items)
            const stockColumns = ds.getMetadata(Stock).columns.map(col => col.databaseName)
            await tm.createQueryBuilder()
                .insert()
                .into(Stock)
                .orUpdate(stockColumns, uniqueStockCols.map(col => utils.camelToSnakeCase(col)))
                .values(stockList)
                .execute()
            stockList = await tm.createQueryBuilder().from(Stock, "st")
                .where(`(st.product_id, st.place_id) IN (${getInTuple(stockList)})`)
                .getMany()

            const document = await tm.getRepository(Document).save(documentService.makePurchaseDocument(req, stockList))

            await tm.createQueryBuilder()
                .insert()
                .into(Account)
                .values(await accountService.updateAccountBalance(req.payments))
                .orUpdate(['balance'], ['id'])
                .execute()

            tm.getRepository(People).save(await peopleService.updateSupplierBalance(req))

            const txList = txService.makeTxList({
                payments: req.payments,
                docId: document.id,
                peopleId: req.supplier,
            } as PaymentTx)
            await tm.createQueryBuilder()
                .insert()
                .into(Tx)
                .values(txList)
                .execute()
        })
    },

    sell: async (req: Invoice) => {

    },
}

function getInTuple(items: { productId: number; placeId: number; }[]): string {
    return items.map(el => `(${el.productId}, ${el.placeId})`).join(",")
}