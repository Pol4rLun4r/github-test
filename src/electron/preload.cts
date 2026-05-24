import electron from "electron";

// função handle dos ipcRenderer.invoke
export const ipcInvoke = <Key extends keyof EventPayloadMapping>(
    channels: Key, data?: unknown
): Promise<EventPayloadMapping[Key]> => {
    return electron.ipcRenderer.invoke(channels, data);
}

// funções que o react irá chamar
const api: API = {
    client: {
        create: (client) => ipcInvoke('client:create', client),
        search: (query) => ipcInvoke('client:search', query)
    },
    quotation: {
        create: (quotation) => ipcInvoke('quotation:create', quotation),
        createWithItems: (allData) => ipcInvoke('quotation:createWithItems', allData),
        getAllSummary: () => ipcInvoke('quotation:getAllSummary'),
        getFullDetail: (quotationId: Quotation['id']) => ipcInvoke('quotation:getFullDetail', quotationId),
    },
    item: {
        searchDescription: (description) => ipcInvoke('item:searchDescription', description),
        createNote: (note) => ipcInvoke('item:createNote', note),
        getNotes: (itemReferenceId) => ipcInvoke('item:getNotes', itemReferenceId),
        getReferenceLinks: (itemReferenceId) => ipcInvoke('item:getReferenceLinks', itemReferenceId),
        getAllBySearch: (description) => ipcInvoke('item:getAllBySearch', description),
        getAllVersionByReferenceId: (itemReferenceId) => ipcInvoke('item:getAllVersionByReferenceId', itemReferenceId)
     },
    window: {
        minimize: () => ipcInvoke('window:minimize'),
        maximizeToggle: () => ipcInvoke('window:maximizeToggle'),
        close: () => ipcInvoke('window:close'),
    }
}

// expondo as APIs do Electron para o renderer process de forma segura
electron.contextBridge.exposeInMainWorld("api", api);