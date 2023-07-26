import { ipcMain } from 'electron';
import { accountHandler } from './account.ipc';
import { txHandler } from './tx.ipc';
import { productHandler } from './product.ipc';
import { peopleHandler } from './people.ipc';

export function registerIPCHandler(ipc: typeof ipcMain) {

    ipc.handle('account:create', accountHandler.save)
    ipc.handle('account:update', accountHandler.save)
    ipc.handle('account:search', accountHandler.search)
    ipc.handle('account:getAll', accountHandler.getAll)

    ipc.handle('tx:search', txHandler.search)

    ipc.handle('product:create', productHandler.create)
    ipc.handle('product:update', productHandler.update)
    ipc.handle('product:search', productHandler.search)
    ipc.handle('product:move', productHandler.move)

    ipc.handle('people:create', peopleHandler.create)
    ipc.handle('people:update', peopleHandler.update)
    ipc.handle('people:search', peopleHandler.search)
    ipc.handle('people:getCustomer', peopleHandler.getCustomer)
    ipc.handle('people:getSupplier', peopleHandler.getSupplier)
    ipc.handle('people:getAll', peopleHandler.getAll)
    ipc.handle('people:getDetails', peopleHandler.getDetails)

}