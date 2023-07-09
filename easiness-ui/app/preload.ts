import { contextBridge, ipcRenderer } from 'electron'
import { Account } from './server/entity/account.entity'
import { FindAccountRequest } from './server/model/account.model'

contextBridge.exposeInMainWorld('electronAPI', {
    createAccount: (req: Account) => ipcRenderer.invoke('account:create', req),
    searchAccount: (req: FindAccountRequest) => ipcRenderer.invoke('account:search', req)
})