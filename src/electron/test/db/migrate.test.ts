/// <reference types="vitest/globals" />

import Database from "better-sqlite3";
import { runMigrations } from "../../db/migrate.js";

describe("runMigrations", () => {
    it("preserva o banco legado e não mexe em boarding", () => {
        const db = new Database(":memory:");
        db.pragma("foreign_keys = ON");

        db.exec(`
            CREATE TABLE item_references (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                description TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE item_values (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                item_reference_id INTEGER NOT NULL,
                position INTEGER NOT NULL,
                quantity INTEGER,
                unit_price REAL,
                markup TEXT,
                purchase_shipping REAL,
                ipi REAL,
                st REAL,
                boarding TEXT,
                extra_value REAL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (item_reference_id) REFERENCES item_references(id) ON DELETE CASCADE
            );
        `);

        db.exec(`
            INSERT INTO item_references (description) VALUES ('Ref 1'), ('Ref 2');

            INSERT INTO item_values (
                item_reference_id, position, quantity, unit_price, markup, purchase_shipping, ipi, st, boarding, extra_value, created_at, updated_at
            ) VALUES
                (1, 1, 1, 10.0, NULL, NULL, NULL, NULL, '3 dias úteis', NULL, '2024-01-01', '2024-01-01'),
                (2, 1, 1, 12.0, NULL, NULL, NULL, NULL, '7', NULL, '2024-01-01', '2024-01-01'),
                (2, 2, 1, 15.0, NULL, NULL, NULL, NULL, 12, NULL, '2024-01-01', '2024-01-01');
        `);

        runMigrations(db);

        const boardingColumn = db.prepare("PRAGMA table_info(item_values)").all() as Array<{ name: string; type: string }>;
        const rows = db.prepare("SELECT id, boarding FROM item_values ORDER BY id").all() as Array<{ id: number; boarding: string | number | null }>;

        expect(boardingColumn.find((column) => column.name === "boarding")?.type).toBe("TEXT");
        expect(boardingColumn.find((column) => column.name === "delivery")?.type).toBe("INTEGER");
        expect(rows).toEqual([
            { id: 1, boarding: "3 dias úteis" },
            { id: 2, boarding: "7" },
            { id: 3, boarding: "12" },
        ]);

        const deliveryRows = db.prepare("SELECT id, delivery FROM item_values ORDER BY id").all() as Array<{ id: number; delivery: number | null }>;
        expect(deliveryRows).toEqual([
            { id: 1, delivery: null },
            { id: 2, delivery: null },
            { id: 3, delivery: null },
        ]);

        db.close();
    });

    it("cria item_values com delivery em banco novo", () => {
        const db = new Database(":memory:");
        db.pragma("foreign_keys = ON");

        runMigrations(db);

        const columns = db.prepare("PRAGMA table_info(item_values)").all() as Array<{ name: string; type: string }>;
        expect(columns.find((column) => column.name === "delivery")?.type).toBe("INTEGER");

        db.close();
    });
});
