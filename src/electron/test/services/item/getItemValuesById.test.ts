/// <reference types="vitest/globals" />

import { createDatabase } from "../../../db/connection.js";
import { createRepositories } from "../../../repositories/index.js";
import { createServices } from "../../../services/index.js";
import { rulesCode } from "../../../rules/item/getItemValuesById.js";

describe("getItemValuesById", () => {
    const db = createDatabase(":memory:");
    const repositories = createRepositories(db);
    const service = createServices(db).item.getItemValuesById;

    afterAll(() => {
        db.close();
    });

    it("retorna o registro de valores pelo identificador", () => {
        const item_reference_id = repositories.item.reference.create({
            description: "Referência para valores",
        });
        const id = repositories.item.values.create(item_reference_id, {
            position: 1,
            quantity: 3,
            unit_price: 25,
            markup: "20",
        });

        const response = service(id);

        expect(response.success).toBe(true);
        if (!response.success) throw new Error(response.data);

        expect(response.data).toMatchObject({
            id,
            item_reference_id,
            position: 1,
            quantity: 3,
            unit_price: 25,
            markup: "20",
        });
    });

    it("falha quando o identificador não é informado", () => {
        expect(service(undefined)).toEqual({
            success: false,
            data: rulesCode.ITEM_VALUES_ID_NOT_INFORMED,
        });
    });

    it("falha quando o identificador é inválido ou não existe", () => {
        expect(service(0)).toEqual({
            success: false,
            data: rulesCode.ITEM_VALUES_ID_INVALID,
        });
        expect(service(999_999)).toEqual({
            success: false,
            data: rulesCode.ITEM_VALUES_NOT_FOUND(999_999),
        });
    });
});
