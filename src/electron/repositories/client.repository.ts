// types
import type { Database } from "better-sqlite3";

// utils
import { onlyNumbers, onlyName } from "../utils/clean.js";

export const createClientRepository = (db: Database) => ({ ...data }: Client) => {
    const document = onlyNumbers(data.document!)
    const name = onlyName(data.name!)

    const client = db.transaction(() => {

        // check or insert client
        const clientQuery = db.prepare(`
            INSERT INTO clients (name, document, type_client, notes)
            VALUES (?, ?, ?, ?) 
            `).run(name, document, data.type_client, data.notes);

        const clientId = clientQuery.lastInsertRowid;

        // get client by id
        const client = db.prepare(`
            SELECT *
            FROM clients
            WHERE id = ?
            LIMIT 1
        `).get(clientId) as Client | undefined;

        return client;
    });

    return client();
}

export const getClientByDocumentRepository = (db: Database) => (document: string | undefined) => {
    // get client document
    const client = db.prepare(`
        SELECT *
        FROM clients
        WHERE document = ?
        LIMIT 1
    `).get(document) as Client | undefined;

    return client;
}

export const getClientByIdRepository = (db: Database) => (id: number | undefined) => {
    // get client by id
    const client = db.prepare(`
        SELECT *
        FROM clients
        WHERE id = ?
        LIMIT 1
    `).get(id) as Client | undefined;

    return client;
}

export const searchClientsByDocumentRepository = (db: Database) => (document: string | undefined) => {
    // get all clients by document
    const clients = db.prepare(`
        SELECT *
        FROM clients
        WHERE document LIKE ? || '%'
        ORDER by name
        LIMIT 10
    `).all(document) as Client[];

    return clients;
}

export const searchClientsByNameRepository = (db: Database) => (name: string | undefined) => {
    // get all clients by name
    const clients = db.prepare(`
        SELECT *
        FROM clients
        WHERE name LIKE ? || '%'
        ORDER by name
        LIMIT 10
    `).all(name) as Client[];

    return clients;
}

export const deleteAllClientsRepository = (db: Database) => () => {
    const deleteAll = db.prepare(`
        DELETE FROM clients
    `).run();

    return deleteAll;
};