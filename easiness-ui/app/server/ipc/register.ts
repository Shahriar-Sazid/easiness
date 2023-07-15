import { ipcMain } from 'electron';
import { accountHandler } from './account.ipc';
import { txHandler } from './tx.ipc';

export function registerIPCHandler(ipc: typeof ipcMain) {
    ipc.handle('account:create', accountHandler.save)
    ipc.handle('account:update', accountHandler.save)
    ipc.handle('account:search', accountHandler.search)
    ipc.handle('account:getAll', accountHandler.getAll)
    ipc.handle('tx:search', txHandler.search)
}