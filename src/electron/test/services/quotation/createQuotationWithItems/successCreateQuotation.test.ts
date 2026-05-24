/// <reference types="vitest/globals" />

// service and repo
import { createDatabase } from "../../../../db/connection.js";
import { createRepositories } from "../../../../repositories/index.js";
import { createServices } from "../../../../services/index.js";

// utils
import { getDBPath } from "../../../../utils/pathResolver.js";
import { fakeItens, fakeItemVersion } from "../../../fakeItens.js";
import { fakeClients } from "../../../fakeClients.js";

describe("Part 2 success create quotation - Create Quotation and Add Items", () => {
    // criar banco de dados antes dos testes
    const db = createDatabase(getDBPath());
    const services = createServices(db);
    const repo = createRepositories(db);

    // apaga os clientes a cada teste
    afterEach(() => {
        repo.client.deleteAll();
    })

    it("ter sucesso ao criar uma nova cotação com notas e status", async () => {
        // 1. prepara o payload
        const payload: CreateWithAllData = {
            client: { ...fakeClients[0] },
            items: [
                {
                    item_reference: { ...fakeItens[0] },
                    reference_links: [],
                    item_version: fakeItemVersion(0, { boarding: "FOB" }),
                },
                {
                    item_reference: { ...fakeItens[0] },
                    reference_links: [
                        { content: '312' }
                    ],
                    item_version: fakeItemVersion(1, { extra_value: 12 }),
                }
            ],
            quotation: { amount: 12, total_value: 431.32, status: 1, notes: "Hello World" }
        }

        // 2. envia a requisição
        const response = services.quotation.createWithItems(payload);

        if (!response.success) {
            throw new Error("Falha ao criar cotação com itens: " + response.data);
        }

        const quotationLinks = response.data;

        const quotationId = quotationLinks[0].quotation_id;
        const sameQuotationVersionId = (
            db.prepare(`
                SELECT id FROM quotation_versions
                WHERE quotation_id = ?
                ORDER BY version DESC
                LIMIT 1
            `).get(quotationId) as { id: number }
        ).id;

        // 3. verifica o resultado
        for (let index = 0; index < quotationLinks.length; index++) {
            const quotation_link = quotationLinks[index];

            expect(quotation_link.quotation_id).toBe(quotationId);

            const resQuotationVersionData = repo.quotation.getByVersionId(sameQuotationVersionId);

            // 3.2 verifica se as notas da cotação é a mesma informada
            expect(resQuotationVersionData?.notes).toBe(payload.quotation.notes);

            // 3.3 verifica se o status é o mesmo informado
            expect(resQuotationVersionData?.status).toBe(payload.quotation.status);
        }
    });
});
