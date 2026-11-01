/// <reference types="vitest/globals" />

// service and repo
import { createDatabase } from "../../../db/connection.js";
import { createRepositories } from "../../../repositories/index.js";
import { createServices } from "../../../services/index.js";

// utils
import { getDBPath } from "../../../utils/pathResolver.js";
import { fakeItens, fakeItemValues } from "../../fakeItens.js";

describe("Pegar cotação completa", () => {
    // criar banco de dados antes dos testes
    const db = createDatabase(getDBPath());
    const services = createServices(db);
    const repo = createRepositories(db);

    beforeAll(() => {
        const itemId = repo.item.reference.create(fakeItens[2]);

        db.prepare(`
            INSERT INTO reference_links (item_reference_id, content)
            VALUES (?, ?)
        `).run(itemId, 'https://family.com');
    })

    const payload: CreateQuotation = {
        items: [
            {
                item_reference: { ...fakeItens[1] },
                reference_links: [
                    { content: 'mother' }
                ],
                item_values: fakeItemValues(1, {
                    quantity: 22,
                    unit_price: 12,
                    markup: "40%",
                    extra_value: 15.5,
                }),
            },
            {
                item_reference: { ...fakeItens[2], id: 1 },
                reference_links: [
                    { content: 'https://family.com' }
                ],
                item_values: fakeItemValues(2, {
                    quantity: 122,
                    unit_price: 24,
                    markup: "40%",
                    boarding: 7,
                    delivery: 14,
                }),
            },
            {
                item_reference: { ...fakeItens[2], id: 1 },
                reference_links: [
                    { content: 'https://family.brazil.com' }
                ],
                item_values: fakeItemValues(3, {
                    quantity: 20,
                    unit_price: 2,
                    markup: "40%",
                    extra_value: 88,
                    boarding: 12,
                    delivery: 18,
                }),
            },
        ],
        quotation: { amount: 3, total_value: 431.32, notes: "Hello world" }
    }

    it("ter sucesso ao pegar cotação completa com detalhes", () => {
        // 1. Prepara os dados
        const create = services.quotation.create(payload);

        if (!create.success) {
            throw new Error(create.data);
        };

        const quotations = services.quotation.getAllSummary();

        if (!quotations.success) {
            throw new Error(quotations.data);
        }

        const quotationId = quotations.data[0].id;

        // 2. chama o serviço
        const quotation = services.quotation.getFull(quotationId);
                        
        if (!quotation.success) {
            throw new Error(quotation.data);
        }

        // 3. verifica se houve o retorno correto
        const quotationData = quotation.data;

        // 3.1 verificar orçamento

        expect(quotationData.quotation.total_value).toBe(payload.quotation.total_value);
        expect(quotationData.quotation.amount).toBe(payload.quotation.amount);
        expect(quotationData.quotation.notes).toBe(payload.quotation.notes);
        expect(quotationData.quotation.status).toBe(0);

        // 3.2 verifica itens
        const itemsData = quotationData.items;
        const itemPayloadData = payload.items;

        for (let index = 0; index < itemsData.length; index++) {
            const item = itemsData[index];
            const itemPayload = itemPayloadData[index]
            
            expect(item.item_reference).toMatchObject(itemPayload.item_reference);
            expect(item.item_values).toMatchObject(itemPayload.item_values);

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

    it("falhar se o id da cotação não for informado", () => {
        const quotation = services.quotation.getFull(undefined as unknown as number);

        expect(quotation.success).toBe(false);
        expect(quotation.data).toBe("ID da cotação não informado.");
    });

    it("falhar se a cotação não existir", () => {
        const quotation = services.quotation.getFull(9999);

        expect(quotation.success).toBe(false);
        expect(quotation.data).toBe("Cotação com ID 9999 não encontrada.");
    });
});
