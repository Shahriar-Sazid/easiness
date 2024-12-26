import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  createAccount: (req) => ipcRenderer.invoke("account:create", req),
  updateAccount: (req) => ipcRenderer.invoke("account:update", req),
  searchAccount: (req) => ipcRenderer.invoke("account:search", req),
  getAllAccount: () => ipcRenderer.invoke("account:getAll"),

  searchTx: (req) => ipcRenderer.invoke("tx:search", req),

  createProduct: (req) => ipcRenderer.invoke("product:create", req),
  updateProduct: (req) => ipcRenderer.invoke("product:update", req),
  searchProduct: (req) => ipcRenderer.invoke("product:search", req),
  moveProduct: (req) => ipcRenderer.invoke("product:move", req),

  createPeople: (req) => ipcRenderer.invoke("people:create", req),
  updatePeople: (req) => ipcRenderer.invoke("people:update", req),
  searchPeople: (req) => ipcRenderer.invoke("people:search", req),
  getAllCustomer: () => ipcRenderer.invoke("people:getCustomer"),
  getAllSupplier: () => ipcRenderer.invoke("people:getSupplier"),
  getAllPeople: () => ipcRenderer.invoke("people:getAll"),
  getPeopleDetails: (req) => ipcRenderer.invoke("people:getDetails", req),

  getUnitData: () => ipcRenderer.invoke("unit:getAll"),

  addAsInitialStock: (req) =>
    ipcRenderer.invoke("stock:addAsInitialStock", req),
  searchStock: (req) => ipcRenderer.invoke("stock:search", req),

  createPlace: (req) => ipcRenderer.invoke("place:create", req),
  updatePlace: (req) => ipcRenderer.invoke("place:update", req),
  findAllPlace: () => ipcRenderer.invoke("place:findAll"),

  searchDocument: (req) => ipcRenderer.invoke("document:search", req),
  getDocumentById: (req) => ipcRenderer.invoke("document:getById", req),
});
