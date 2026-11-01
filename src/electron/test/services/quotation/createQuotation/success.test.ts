/// <reference types="vitest/globals" />

// service and repo
import { createDatabase } from "../../../../db/connection.js";
import { createRepositories } from "../../../../repositories/index.js";
import { createServices } from "../../../../services/index.js";

// utils
import { getDBPath } from "../../../../utils/pathResolver.js";
import { fakeItens, fakeItemValues } from "../../../fakeItens.js";

describe("Sucessos ao criar cotação", () => {
    // criar banco de dados antes dos testes
    const db = createDatabase(getDBPath());
    const services = createServices(db);
    const repo = createRepositories(db);

    const expectFunction = (quotationLinks: QuotationLink[], payload: CreateQuotation) => {
        for (let index = 0; index < quotationLinks.length; index++) {
            const quotation_link = quotationLinks[index];

            // verifica se os itens foram criados
            const itemReferenceData = repo.item.reference.getById(quotation_link.item_reference_id);
            const itemVersionData = repo.item.values.getById(quotation_link.item_values_id);

            // 3.1 verifica se a descrição do item é o mesmo informado
            expect(itemReferenceData?.description).toBe(payload.items[index].item_reference.description);

            // 3.2 verifica se o código interno é o mesmo informado
            expect(itemReferenceData?.internal_code).toBe(payload.items[index].item_reference.internal_code);

            // 3.3 verifica se o código do fabricante é o mesmo informado
            expect(itemReferenceData?.manufacturer_code).toBe(payload.items[index].item_reference.manufacturer_code);

            // 3.4 verifica se o ncm é o mesmo informado
            expect(itemReferenceData?.ncm).toBe(payload.items[index].item_reference.ncm);

            // 3.5 verifica se as notas são as mesmas informadas
            const payloadNotes = payload.items[index].item_reference.notes;
            const normalizedPayloadNotes = payloadNotes?.trim();
            if (normalizedPayloadNotes) {
                expect(itemReferenceData?.notes).toBe(normalizedPayloadNotes);
            } else {
                expect(itemReferenceData?.notes ?? null).toBe(null);
            }

            // verifica os links de referência do item
            const payloadLinks = payload.items[index].reference_links ?? [];
            const filteredPayloadLinks = payloadLinks.filter((link) => (link.content ?? "").trim().length > 0);
            const referenceLinks = db.prepare(`
                SELECT content FROM reference_links
                WHERE item_reference_id = ?
                ORDER BY id ASC
            `).all(quotation_link.item_reference_id) as { content: string }[];

            expect(referenceLinks).toHaveLength(filteredPayloadLinks.length);

            for (let linkIndex = 0; linkIndex < filteredPayloadLinks.length; linkIndex++) {
                expect(referenceLinks[linkIndex]?.content).toBe(filteredPayloadLinks[linkIndex].content);
            }

            //verifica os valores do item criado

            // 3.7 verifica se a posição é a mesma informada
            expect(itemVersionData?.position).toBe(payload.items[index].item_values.position);

            // 3.8 verifica se a quantidade é a mesma informada
            const payloadQuantity = payload.items[index].item_values.quantity ?? 1;
            expect(itemVersionData?.quantity).toBe(payloadQuantity);

            // 3.9 verifica se o preço unitário é o mesmo informado
            expect(itemVersionData?.unit_price).toBe(payload.items[index].item_values.unit_price);

            // 3.10 verifica se o markup é o mesmo informado
            if (payload.items[index].item_values.markup !== null && payload.items[index].item_values.markup !== undefined) {
                expect(itemVersionData?.markup).toBe(payload.items[index].item_values.markup);
            } else {
                expect(itemVersionData?.markup).toBe(null);
            }

            // 3.11 verifica se o frete de compra é o mesmo informado
            if (payload.items[index].item_values.purchase_shipping !== null && payload.items[index].item_values.purchase_shipping !== undefined) {
                expect(itemVersionData?.purchase_shipping).toBe(payload.items[index].item_values.purchase_shipping);
            } else {
                expect(itemVersionData?.purchase_shipping).toBe(null);
            }

            // 3.12 verifica se o ipi é o mesmo informado
            if (payload.items[index].item_values.ipi !== null && payload.items[index].item_values.ipi !== undefined) {
                expect(itemVersionData?.ipi).toBe(payload.items[index].item_values.ipi);
            } else {
                expect(itemVersionData?.ipi).toBe(null);
            }

            // 3.13 verifica se o st é o mesmo informado
            if (payload.items[index].item_values.st !== null && payload.items[index].item_values.st !== undefined) {
                expect(itemVersionData?.st).toBe(payload.items[index].item_values.st);
            } else {
                expect(itemVersionData?.st).toBe(null);
            }

            // 3.14 verifica se o valor extra é o mesmo informado
            if (payload.items[index].item_values.extra_value !== null && payload.items[index].item_values.extra_value !== undefined) {
                expect(itemVersionData?.extra_value).toBe(payload.items[index].item_values.extra_value);
            } else {
                expect(itemVersionData?.extra_value).toBe(null);
            }

            // 3.15 verifica se o embarque é o mesmo informado
            if (payload.items[index].item_values.boarding !== null && payload.items[index].item_values.boarding !== undefined) {
                expect(itemVersionData?.boarding).toBe(payload.items[index].item_values.boarding);
            } else {
                expect(itemVersionData?.boarding).toBe(null);
            }

            // 3.16 verifica se a entrega é a mesma informada
            if (payload.items[index].item_values.delivery !== null && payload.items[index].item_values.delivery !== undefined) {
                expect(itemVersionData?.delivery).toBe(payload.items[index].item_values.delivery);
            } else {
                expect(itemVersionData?.delivery).toBe(null);
            }
        }
    }

    it("ter sucesso ao criar items com e sem links e valores", async () => {
        // 1. prepara o payload
        const payload: CreateQuotation = {
            items: [
                {
                    item_reference: { ...fakeItens[0], notes: "Cabo para instalação interna" },
                    reference_links: [],
                    item_values: fakeItemValues(0, {
                        ipi: 1.3,
                        boarding: 7,
                        delivery: 10,
                    }),
                },
                {
                    item_reference: { ...fakeItens[1] },
                    reference_links: [
                        { content: '312' }
                    ],
                    item_values: fakeItemValues(1, {
                        markup: "40",
                        extra_value: 15.5,
                    }),
                },
                {
                    item_reference: { ...fakeItens[2] },
                    reference_links: [
                        { content: 'https://nota1.com' },
                        { content: 'nota 2' }
                    ],
                    item_values: fakeItemValues(2, {
                        purchase_shipping: 31,
                        st: 43,
                        extra_value: 88,
                        boarding: 15,
                        delivery: 20,
                    }),
                }
            ],
            quotation: { amount: 3, total_value: 431.32 }
        }

        // 2. envia a requisição
        const response = services.quotation.create(payload);

        if (!response.success) {
            throw new Error("Falha ao criar cotação com itens: " + response.data);
        };

        const quotationLinks = response.data;

        expectFunction(quotationLinks, payload);
    });

    it("ter sucesso ao criar uma cotação com uma única nota e um único item", async () => {
        const payload: CreateQuotation = {
            items: [
                {
                    item_reference: { ...fakeItens[0] },
                    reference_links: [],
                    item_values: fakeItemValues(0, {
                        unit_price: 20,
                    }),
                }
            ],
            quotation: { amount: 1, total_value: 20, notes: "Cotação de teste para fluxo mínimo" }
        }

        const response = services.quotation.create(payload);

        if (!response.success) {
            throw new Error("Falha ao criar cotação com um item: " + response.data);
        };

        const quotationLinks = response.data;

        expectFunction(quotationLinks, payload);
    });

    it("ter sucesso ao criar itens sem campos opcionais e com links vazios", async () => {
        const payload: CreateQuotation = {
            items: [
                {
                    item_reference: { ...fakeItens[2], notes: "   " },
                    reference_links: [
                        { content: "   " },
                        { content: "https://link-valido.com" }
                    ],
                    item_values: {
                        position: 1,
                        unit_price: 10,
                    },
                }
            ],
            quotation: { amount: 1, total_value: 10 }
        }

        const response = services.quotation.create(payload);

        if (!response.success) {
            throw new Error("Falha ao criar cotação com campos opcionais: " + response.data);
        };

        const quotationLinks = response.data;

        expectFunction(quotationLinks, payload);
    });

    it("ter sucesso ao criar items que já existem no banco de dados", async () => {
        const itemPayload = fakeItens[1];

        const itemId = repo.item.reference.create(itemPayload);

        // 1. prepara o payload
        const payload: CreateQuotation = {
            items: [
                {
                    item_reference: { ...fakeItens[1], id: itemId },
                    reference_links: [],
                    item_values: fakeItemValues(0, {
                        ipi: 1.3,
                        boarding: 9,
                        delivery: 12,
                    }),
                },
                {
                    item_reference: { ...fakeItens[1], id: itemId },
                    reference_links: [],
                    item_values: fakeItemValues(1, {
                        quantity: 22,
                        unit_price: 43,
                        ipi: 1.3,
                        extra_value: 10,
                    }),
                }
            ],
            quotation: { amount: 2, total_value: 431.32 }
        }

        // 2. envia a requisição
        const response = services.quotation.create(payload);

        if (!response.success) {
            throw new Error("Falha ao criar cotação com itens: " + response.data);
        };

        const quotationLinks = response.data;

        expectFunction(quotationLinks, payload);
    });
});
