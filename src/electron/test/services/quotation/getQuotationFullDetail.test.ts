/// <reference types="vitest/globals" />

// service and repo
import { createDatabase } from "../../../db/connection.js";
import { createRepositories } from "../../../repositories/index.js";
import { createServices } from "../../../services/index.js";

// utils
import { getDBPath } from "../../../utils/pathResolver.js";
import { fakeClients } from "../../fakeClients.js";
import { fakeItens, fakeItemVersion } from "../../fakeItens.js";
import { normalizeDocument } from "../../../utils/clean.js";

describe("Get full quotation with details", () => {
    // criar banco de dados antes dos testes
    const db = createDatabase(getDBPath());
    const services = createServices(db);
    const repo = createRepositories(db);

    beforeAll(() => {
        const itemId = repo.item.createReference(fakeItens[2]);

        db.prepare(`
            INSERT INTO reference_links (item_reference_id, content)
            VALUES (?, ?)
        `).run(itemId, 'https://family.com');
    })

    const payload: CreateWithAllData = {
        client: { ...fakeClients[0] },
        items: [
            {
                item_reference: { ...fakeItens[1] },
                reference_links: [
                    { content: 'mother' }
                ],
                item_version: fakeItemVersion(1, {
                    quantity: 22,
                    unit_price: 12,
                    markup: "40.1",
                    extra_value: 15.5,
                }),
            },
            {
                item_reference: { ...fakeItens[2], id: 1 },
                reference_links: [
                    { content: 'https://family.com' }
                ],
                item_version: fakeItemVersion(2, {
                    quantity: 122,
                    unit_price: 24,
                    markup: "40.1",
                    boarding: "FOB",
                }),
            },
            {
                item_reference: { ...fakeItens[2], id: 1 },
                reference_links: [
                    { content: 'https://family.brazil.com' }
                ],
                item_version: fakeItemVersion(3, {
                    quantity: 20,
                    unit_price: 2,
                    markup: "40.1",
                    extra_value: 88,
                    boarding: "CIF",
                }),
            },
        ],
        quotation: { amount: 12, total_value: 431.32, status: 1, notes: "Hello world" }
    }

    it("ter sucesso ao pegar cotação completa com detalhes", () => {
        // 1. Prepara os dados
        const create = services.quotation.createWithItems(payload);

        if (!create.success) {
            throw new Error(create.data);
        };

        const quotations = services.quotation.getAllSummary();

        if (!quotations.success) {
            throw new Error(quotations.data);
        }

        const quotationId = quotations.data[0].quotation_id;

        // 2. chama o serviço
        const quotation = services.quotation.getFullDetail(quotationId);

        if (!quotation.success) {
            throw new Error(quotation.data);
        }

        // 3. verifica se houve o retorno correto
        const quotationData = quotation.data;

        // 3.1 verificação do cliente
        expect(quotationData.client.name).toBe(payload.client.name.toLocaleLowerCase());
        expect(quotationData.client.document).toBe(normalizeDocument(payload.client.document));
        expect(quotationData.client.type_client).toBe(payload.client.type_client);
        expect(quotationData.client.notes).toBe(payload.client.notes);

        // 3.2 verificar orçamento
        expect(quotationData.quotation_version.total_value).toBe(payload.quotation.total_value);
        expect(quotationData.quotation_version.amount).toBe(payload.quotation.amount);
        expect(quotationData.quotation_version.notes).toBe(payload.quotation.notes);
        expect(quotationData.quotation_version.status).toBe(payload.quotation.status);

        // 3.3 verifica itens
        const itemsData = quotationData.items;
        const itemPayloadData = payload.items;

        for (let index = 0; index < itemsData.length; index++) {
            const item = itemsData[index];
            const itemPayload = itemPayloadData[index]
            
            expect(item.item_reference).toMatchObject(itemPayload.item_reference);
            expect(item.item_version).toMatchObject(itemPayload.item_version);

            if (index === 0) {
                expect(item.reference_links[0]).toMatchObject({ content: itemPayload.reference_links[0].content });
            }

            if (index === 1) {
                expect(item.reference_links[0]).toMatchObject({ content: 'https://family.com' });
            }

            if (index === 2) {
                expect(item.reference_links[0]).toMatchObject({ content: 'https://family.com' });
            }
        }
    });
});