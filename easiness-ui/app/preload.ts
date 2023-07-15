import { contextBridge, ipcRenderer } from 'electron'
import { Account } from './server/entity/account.entity'
import { FindAccountRequest } from './server/model/account.model'
import { FindTxReq } from './server/model/tx.model'

contextBridge.exposeInMainWorld('electronAPI', {
    createAccount: (req: Account) => ipcRenderer.invoke('account:create', req),
    updateAccount: (req: Account) => ipcRenderer.invoke('account:update', req),
    searchAccount: (req: FindAccountRequest) => ipcRenderer.invoke('account:search', req),
    getAllAccount: () => ipcRenderer.invoke('account:getAll'),
    searchTx: (req: FindTxReq) => ipcRenderer.invoke('tx:search', req),
})