import { ipcMain } from "electron";
import { accountHandler } from "./account.ipc";
import { txHandler } from "./tx.ipc";
import { productHandler } from "./product.ipc";
import { peopleHandler } from "./people.ipc";
import { unitHandler } from "./unit.ipc";
import { stockHandler } from "./stock.ipc";
import { placeHandler } from "./place.ipc";
import { documentHandler } from "./document.ipc";

export function registerIPCHandler(ipc: typeof ipcMain) {
  ipc.handle("account:create", accountHandler.save);
  ipc.handle("account:update", accountHandler.save);
  ipc.handle("account:search", accountHandler.search);
  ipc.handle("account:getAll", accountHandler.getAll);

  ipc.handle("tx:search", txHandler.search);

  ipc.handle("product:create", productHandler.create);
  ipc.handle("product:update", productHandler.update);
  ipc.handle("product:search", productHandler.search);
  ipc.handle("product:move", productHandler.move);

  ipc.handle("people:create", peopleHandler.create);
  ipc.handle("people:update", peopleHandler.update);
  ipc.handle("people:search", peopleHandler.search);
  ipc.handle("people:getCustomer", peopleHandler.getCustomer);
  ipc.handle("people:getSupplier", peopleHandler.getSupplier);
  ipc.handle("people:getAll", peopleHandler.getAll);
  ipc.handle("people:getDetails", peopleHandler.getDetails);

  ipc.handle("unit:getAll", unitHandler.getAll);

  ipc.handle("place:create", placeHandler.create);
  ipc.handle("place:update", placeHandler.update);
  ipc.handle("place:findAll", placeHandler.findAll);

  ipc.handle("stock:addAsInitialStock", stockHandler.addAsInitialStock);
  ipc.handle("stock:search", stockHandler.search);

  ipc.handle("document:search", documentHandler.findAll);
  ipc.handle("document:getById", documentHandler.getDetails);
}
