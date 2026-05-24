import * as Database from "better-sqlite3";
import type { Database as DatabaseType } from "better-sqlite3";
import { runMigrations } from "./migrate.js";

export const createDatabase = (dbPath: string): DatabaseType => {
    const db = new Database.default(dbPath);

    db.pragma("foreign_keys = ON");
    runMigrations(db);

    return db;
};