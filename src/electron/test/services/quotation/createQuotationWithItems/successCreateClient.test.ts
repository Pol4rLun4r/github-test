/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vitest/globals" />

// service and repo
import { createDatabase } from "../../../../db/connection.js";
import { createRepositories } from "../../../../repositories/index.js";
import { createServices } from "../../../../services/index.js";

// utils
import { getDBPath } from "../../../../utils/pathResolver.js";
import { fakeItens, fakeItemVersion } from "../../../fakeItens.js";
import { fakeClients } from "../../../fakeClients.js";
import { normalizeDocument, onlyName } from "../../../../utils/clean.js";

const itemsPayload: CreateWithAllData['items'] = [
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
]


describe("Part 1 success create client - Create Quotation and Add Items", () => {
    // criar banco de dados antes dos testes
    const db = createDatabase(getDBPath());
    const services = createServices(db);
    const repo = createRepositories(db);

    // apaga os clientes a cada teste
    afterEach(() => {
        repo.client.deleteAll();
    })

    const expectCreateClient = (payload: CreateWithAllData) => {
        const response = services.quotation.createWithItems(payload);

        if (!response.success) {
            throw new Error("Falha ao criar cotação com itens: " + response.data);
        }

        const quotationLinks = response.data;

        const quotationId = quotationLinks[0].quotation_id;
        const latestVersionId = (
            db.prepare(`
                SELECT id FROM quotation_versions
                WHERE quotation_id = ?
                ORDER BY version DESC
                LIMIT 1
            `).get(quotationId) as { id: number }
        ).id;
        const resQuotationVersionData = repo.quotation.getByVersionId(latestVersionId);
        const resClientId = resQuotationVersionData?.client_id;
        const resClientData = repo.client.getById(resClientId);

        // 3. verifica o resultado
        for (let index = 0; index < quotationLinks.length; index++) {
            const quotation_link = quotationLinks[index];

            expect(quotation_link.quotation_id).toBe(quotationId);

            function expectFunction({ payloadFunction }: { payloadFunction: { client: Client } }) {
                // 3.1 verifica se o nome do cliente é o mesmo informado
                expect(resClientData?.name).toBe(onlyName(payloadFunction.client.name));

                // 3.2 verifica se o documento do cliente é o mesmo informado
                expect(resClientData?.document).toBe(normalizeDocument(payloadFunction.client.document));

                // 3.3 verifica se as notas do cliente é a mesma informada
                expect(resClientData?.notes === null ? undefined : resClientData?.notes).toBe(payloadFunction.client.notes);

                // 3.4 verifica se o typo de cliente é o mesmo informado
                expect(resClientData?.type_client).toBe(payloadFunction.client.type_client);
            };

            if (resClientData?.id) {
                return expectFunction({ payloadFunction: { client: fakeClients[0] } });
            }

            return expectFunction({ payloadFunction: { client: payload.client } });
        }
    }

    it("ter sucesso ao criar um novo cliente com notas", async () => {
        // 1. prepara o payload
        const payload: CreateWithAllData = {
            client: fakeClients[0],
            items: itemsPayload,
            quotation: { amount: 12, total_value: 431.32, status: 1 }
        }

        // 2. envia a requisição
        expectCreateClient(payload);
    });

    it("ter sucesso ao usar um cliente que já existe", async () => {

        // 1. prepara o payload
        const clientId = repo.client.create({ ...fakeClients[0] } as any)?.id;

        const payload: CreateWithAllData = {
            client: { id: clientId } as any,
            items: itemsPayload,
            quotation: { amount: 12, total_value: 431.32, status: 1 }
        }

        // 2. envia a requisição
        expectCreateClient(payload);
    });

    it("ter sucesso ao criar um cliente que já existe", async () => {

        // 1. prepara o payload
        repo.client.create({ ...fakeClients[0] });

        const payload: CreateWithAllData = {
            client: { ...fakeClients[0] },
            items: itemsPayload,
            quotation: { amount: 12, total_value: 431.32, status: 1 }
        }

        // 2. envia a requisição
        expectCreateClient(payload);
    });
});
