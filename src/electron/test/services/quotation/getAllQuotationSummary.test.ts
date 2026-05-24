/// <reference types="vitest/globals" />

// service and repo
import { createDatabase } from "../../../db/connection.js";
import { createServices } from "../../../services/index.js";
import { normalizeDocument } from "../../../utils/clean.js";

// utils
import { getDBPath } from "../../../utils/pathResolver.js";
import { fakeClients } from "../../fakeClients.js";
import { fakeItens, fakeItemVersion } from "../../fakeItens.js";

describe("Get all quotations summary", () => {
    // criar banco de dados antes dos testes
    const db = createDatabase(getDBPath());
    const services = createServices(db);

    const payload: CreateWithAllData = {
        client: { ...fakeClients[0] },
        items: [
            {
                item_reference: { ...fakeItens[0] },
                reference_links: [],
                item_version: fakeItemVersion(0, {
                    ipi: 1.3,
                    boarding: "FOB",
                }),
            },
            {
                item_reference: { ...fakeItens[1] },
                reference_links: [
                    { content: '312' }
                ],
                item_version: fakeItemVersion(1, {
                    markup: "40.1",
                    extra_value: 15.5,
                }),
            },
            {
                item_reference: { ...fakeItens[2] },
                reference_links: [
                    { content: 'https://nota1.com' },
                    { content: 'nota 2' }
                ],
                item_version: fakeItemVersion(2, {
                    purchase_shipping: 31,
                    st: 43,
                    extra_value: 88,
                    boarding: "CIF",
                }),
            }
        ],
        quotation: { amount: 12, total_value: 431.32, status: 1, notes: "Hello world" }
    }

    it("ter sucesso ao pegar as cotações resumidas", () => {
        // 1. prepara os dados
        services.quotation.createWithItems(payload);
        services.quotation.createWithItems(payload);

        // 2. chama o serviço
        const quotations = services.quotation.getAllSummary();

        // 3. verifica se houve o retorno correto
        if (!quotations.success) {
            throw new Error(quotations.data);
        }

        const quotationData = quotations.data

        // deve retornar dois orçamentos
        expect(quotationData.length).toBe(2);

        for (let index = 0; index < quotationData.length; index++) {
            const quotationSummary = quotationData[index];

            expect(quotationSummary.client_name).toBe(payload.client.name.toLocaleLowerCase());
            expect(quotationSummary.client_document).toBe(normalizeDocument(payload.client.document));
            expect(quotationSummary.total_value).toBe(payload.quotation.total_value);
            expect(quotationSummary.status).toBe(payload.quotation.status);
            expect(quotationSummary.amount).toBe(payload.quotation.amount);
        }
    });
});