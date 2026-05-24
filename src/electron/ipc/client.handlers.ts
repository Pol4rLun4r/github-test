// database
import type { Database } from "better-sqlite3";

// services
import { createServices } from "../services/index.js";

// utils
import { ipcMainHandle } from "../utils/electron.js";

const clientHandlers = (db: Database) => {
    const services = createServices(db);

    ipcMainHandle('client:create', services.client.create);
    ipcMainHandle('client:search', services.client.search);
}

export default clientHandlers;