// database
import type { Database } from "better-sqlite3";

// services
import { createServices } from "../services/index.js";

// utils
import { ipcMainHandle } from "../utils/electron.js";

const itemHandlers = (db: Database) => {
    const services = createServices(db);

    ipcMainHandle('item:searchDescription', services.item.searchDescription);
    ipcMainHandle('item:getNotes', services.item.getNotes);
    ipcMainHandle('item:getReferenceLinks', services.item.getReferenceLinks);
    ipcMainHandle('item:createNote', services.item.createNote);
    ipcMainHandle('item:getAllBySearch', services.item.getAllBySearch);
    ipcMainHandle('item:getAllVersionByReferenceId', services.item.getAllVersionByReferenceId);
}

export default itemHandlers;