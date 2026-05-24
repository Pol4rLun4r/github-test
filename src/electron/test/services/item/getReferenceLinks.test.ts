/// <reference types="vitest/globals" />

// service and repo
import { createDatabase } from "../../../db/connection.js";
import { createRepositories } from "../../../repositories/index.js";
import { createServices } from "../../../services/index.js";

// utils
import { getDBPath } from "../../../utils/pathResolver.js";

describe("Get reference links", () => {
    const db = createDatabase(getDBPath());
    const services = createServices(db);
    const repo = createRepositories(db);

    const itemReference: ItemReference = { description: "Monster" };
    const itemReferenceId = repo.item.createReference(itemReference);

    const referenceLinks: ReferenceLink[] = [
        {
            item_reference_id: itemReferenceId,
            content: "material contra explosão",
        },
        {
            item_reference_id: itemReferenceId,
            content: "https://aluminium.wetzel.com.br/produtos/",
        },
    ];

    referenceLinks.forEach((link) => {
        repo.item.createReferenceLink(link.item_reference_id, { ...link });
    });

    it("ter sucesso ao pegar os links de referência do item", () => {
        const res = services.item.getReferenceLinks(itemReferenceId);

        if (!res.success) throw new Error("Falha ao pegar links: " + res.data);

        expect(res.data).toMatchObject(referenceLinks);
    });

    it("falhar ao pegar os links de um item de referência que não existe", () => {
        const res = services.item.getReferenceLinks(9999);

        expect(res.success).toBe(false);
        expect(res.data).toBe("ID da referência do item não existe");
    });
});
