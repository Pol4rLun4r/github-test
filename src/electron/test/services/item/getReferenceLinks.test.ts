/// <reference types="vitest/globals" />

// service and repo
import { createDatabase } from "../../../db/connection.js";
import { createRepositories } from "../../../repositories/index.js";
import { createServices } from "../../../services/index.js";

// rules
import { rulesCode } from "../../../rules/item/getReferenceLinks.js";

// utils
import { getDBPath } from "../../../utils/pathResolver.js";

describe("Pegar links de referencias", () => {
    const db = createDatabase(getDBPath());
    const services = createServices(db);
    const repo = createRepositories(db);

    const createReferenceWithLinks = (contents: string[]) => {
        const response = services.quotation.create({
            quotation: { amount: 1, total_value: 1 },
            items: [
                {
                    item_reference: { description: "Referência com links" },
                    reference_links: contents.map((content) => ({ content })),
                    item_values: { position: 0, quantity: 1 },
                },
            ],
        });

        if (!response.success) {
            throw new Error("Falha ao criar referência para o teste: " + response.data);
        }

        return response.data[0].item_reference_id;
    };

    it("retorna todos os links associados à referência", () => {
        const contents = [
            "material contra explosão",
            "https://aluminium.wetzel.com.br/produtos/",
        ];
        const itemReferenceId = createReferenceWithLinks(contents);

        const response = services.item.getReferenceLinks(itemReferenceId);

        if (!response.success) {
            throw new Error("Falha ao pegar links: " + response.data);
        }

        expect(response.data).toHaveLength(contents.length);
        expect(response.data).toMatchObject(
            contents.map((content) => ({ item_reference_id: itemReferenceId, content })),
        );
    });

    it("retorna uma coleção vazia para uma referência existente sem links", () => {
        const itemReferenceId = repo.item.reference.create({ description: "Referência sem links" });

        const response = services.item.getReferenceLinks(itemReferenceId);

        expect(response).toEqual({ success: true, data: [] });
    });

    it("falha quando o identificador da referência não é informado", () => {
        const response = services.item.getReferenceLinks(undefined as unknown as GetReferenceLinks);

        expect(response).toEqual({
            success: false,
            data: rulesCode.ITEM_REFERENCE_ID_NOT_INFORMED,
        });
    });

    it("falha quando a referência informada não existe", () => {
        const itemReferenceId = 999_999;

        const response = services.item.getReferenceLinks(itemReferenceId);

        expect(response).toEqual({
            success: false,
            data: rulesCode.ITEM_REFERENCE_NOT_FOUND(itemReferenceId),
        });
    });
});
