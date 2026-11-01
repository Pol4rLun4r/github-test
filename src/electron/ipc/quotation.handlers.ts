// database
import type { Database } from "better-sqlite3";

// services
import { createServices } from "../services/index.js";

// utils
import { ipcMainHandle } from "../utils/electron.js";

const quotationHandlers = (db: Database) => {
    const services = createServices(db);

    ipcMainHandle('quotation:create', services.quotation.create);
    ipcMainHandle('quotation:getAllSummary', services.quotation.getAllSummary);
    ipcMainHandle('quotation:getFull', services.quotation.getFull);
    ipcMainHandle('quotation:getByItemValuesId', services.quotation.getByItemValuesId);
    ipcMainHandle('quotation:update', services.quotation.update);
}

export default quotationHandlers;