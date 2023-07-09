import { ipcMain } from 'electron';
import { accountHandler } from './account.ipc';

export function registerIPCHandler(ipc: typeof ipcMain) {
    ipc.handle('account:create', accountHandler.create)
    ipc.handle('account:search', accountHandler.search)
}