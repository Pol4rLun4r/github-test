/// <reference types="vitest/globals" />

import { createDatabase } from "../../../db/connection.js";
import { createRepositories } from "../../../repositories/index.js";
import { createServices } from "../../../services/index.js";
import { rulesCode } from "../../../rules/item/getItemDetailsByReferenceId.js";
import { getDBPath } from "../../../utils/pathResolver.js";

describe("getItemDetailsByReferenceId", () => {
    const db = createDatabase(getDBPath());
    const repositories = createRepositories(db);
    const service = createServices(db).item.getItemDetailsByReferenceId;

    afterAll(() => {
        db.close();
    });

    it("retorna a referência com links, a quantidade total e o valor mais recente", () => {
        const item_reference_id = repositories.item.reference.create({
            description: "Referência para detalhes",
        });
        repositories.item.referenceLinks.create(item_reference_id, {
            item_reference_id,
            content: "https://example.com/item",
        });

        const insertValue = db.prepare(`
            INSERT INTO item_values (item_reference_id, position, quantity, unit_price, created_at)
            VALUES (?, ?, ?, ?, ?)
        `);

        for (let position = 1; position <= 7; position += 1) {
            insertValue.run(
                item_reference_id,
                position,
                1,
                position * 10,
                `2026-01-${String(position).padStart(2, "0")} 12:00:00`,
            );
        }

        const response = service(item_reference_id);

        expect(response.success).toBe(true);
        if (!response.success) throw new Error(response.data);

        expect(response.data.item_with_reference_links).toMatchObject({
            id: item_reference_id,
            description: "Referência para detalhes",
            reference_links: [
                { item_reference_id, content: "https://example.com/item" },
            ],
        });
        expect(response.data.item_values_records).toBe(7);
        expect(response.data.latest_price).toMatchObject({
            item_reference_id,
            position: 7,
            unit_price: 70,
        });
    });

    it("retorna sucesso com zero registros quando a referência ainda não tem valores", () => {
        const item_reference_id = repositories.item.reference.create({
            description: "Referência sem valores",
        });

        const response = service(item_reference_id);

        expect(response.success).toBe(true);
        if (!response.success) throw new Error(response.data);

        expect(response.data).toMatchObject({
            item_with_reference_links: {
                id: item_reference_id,
                description: "Referência sem valores",
                reference_links: [],
                created_at: expect.any(String),
                updated_at: expect.any(String),
            },
            item_values_records: 0,
        });
        expect(response.data.latest_price).toBeUndefined();
    });

    it("falha quando o identificador não é informado", () => {
        const response = service(undefined as unknown as number);

        expect(response).toEqual({
            success: false,
            data: rulesCode.ITEM_REFERENCE_ID_NOT_INFORMED,
        });
    });

    it("falha quando a referência não existe", () => {
        const item_reference_id = 999_999;
        const response = service(item_reference_id);

        expect(response).toEqual({
            success: false,
            data: rulesCode.ITEM_REFERENCE_NOT_FOUND(item_reference_id),
        });
    });
});
