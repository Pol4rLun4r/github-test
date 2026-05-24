/// <reference types="vitest/globals" />

// service and repo
import { createDatabase } from "../../../db/connection.js";
import { createRepositories } from "../../../repositories/index.js";
import { createServices } from "../../../services/index.js";

// utils
import { getDBPath } from "../../../utils/pathResolver.js";

describe('Get item notes', () => {
    const db = createDatabase(getDBPath());
    const services = createServices(db);
    const repo = createRepositories(db);

    const itemReference: ItemReference = {
        description: "Monster",
        notes: "material contra explosão",
    };
    const itemReferenceId = repo.item.createReference(itemReference);

    it('ter sucesso ao pegar as notas do item', () => {
        const payload = itemReferenceId;

        const res = services.item.getNotes(payload);

        if (!res.success) throw new Error("Falha ao pegar notas: " + res.data);

        expect(res.data).toBe(itemReference.notes);
    });


    it('falhar ao pegar as notas de um item de referência que não existe', () => {
        const payload = 9999;

        const res = services.item.getNotes(payload);

        expect(res.success).toBe(false);
        expect(res.data).toBe("ID da referência do item não existe");
    })
});
