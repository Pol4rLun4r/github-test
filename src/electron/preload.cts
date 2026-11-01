import electron from "electron";

// função handle dos ipcRenderer.invoke
export const ipcInvoke = <Key extends keyof EventPayloadMapping>(
    channels: Key, data?: unknown
): Promise<EventPayloadMapping[Key]> => {
    return electron.ipcRenderer.invoke(channels, data);
}

// funções que o react irá chamar
const api: API = {
    quotation: {
        create: (quotation) => ipcInvoke('quotation:create', quotation),
        getAllSummary: () => ipcInvoke('quotation:getAllSummary'),
        getFull: (quotationId: Quotation['id']) => ipcInvoke('quotation:getFull', quotationId),
        getByItemValuesId: (itemValuesId: ItemValues["id"]) => ipcInvoke('quotation:getByItemValuesId', itemValuesId),
        update: (quotation) => ipcInvoke('quotation:update', quotation),
    },
    item: {
        searchDescription: (description) => ipcInvoke('item:searchDescription', description),
        findItemReferences: (description) => ipcInvoke('item:findItemReferences', description),
        getReferenceLinks: (itemReferenceId) => ipcInvoke('item:getReferenceLinks', itemReferenceId),
        getAllValuesByReferenceId: (itemReferenceId) => ipcInvoke('item:getAllValuesByReferenceId', itemReferenceId),
        getValuesById: (itemValuesId) => ipcInvoke('item:getValuesById', itemValuesId),
        getDetailsByReferenceId: (itemReferenceId) => ipcInvoke('item:getDetailsByReferenceId', itemReferenceId),
        updateReference: (payload) => ipcInvoke('item:updateReference', payload),
     },
    window: {
        minimize: () => ipcInvoke('window:minimize'),
        maximizeToggle: () => ipcInvoke('window:maximizeToggle'),
        close: () => ipcInvoke('window:close'),
    }
}

// expondo as APIs do Electron para o renderer process de forma segura
electron.contextBridge.exposeInMainWorld("api", api);