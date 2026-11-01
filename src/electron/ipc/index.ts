import type { Database } from "better-sqlite3";

// handlers
import quotationHandlers from "./quotation.handlers.js";
import itemHandlers from "./item.handlers.js";
import windowHandlers from "./window.handlers.js";

const ipcHandlers = (db: Database) => {
    windowHandlers();
    quotationHandlers(db);
    itemHandlers(db);
};

export default ipcHandlers;