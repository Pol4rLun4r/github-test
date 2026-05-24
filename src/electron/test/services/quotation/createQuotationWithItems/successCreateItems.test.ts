/// <reference types="vitest/globals" />

// service and repo
import { createDatabase } from "../../../../db/connection.js";
import { createRepositories } from "../../../../repositories/index.js";
import { createServices } from "../../../../services/index.js";

// utils
import { getDBPath } from "../../../../utils/pathResolver.js";
import { fakeItens, fakeItemVersion } from "../../../fakeItens.js";
import { fakeClients } from "../../../fakeClients.js";

describe("Part 3 success create items - Create Quotation and Add Items", () => {
    // criar banco de dados antes dos testes
    const db = createDatabase(getDBPath());
    const services = createServices(db);
    const repo = createRepositories(db);

    // apaga os clientes a cada teste
    afterEach(() => {
        repo.client.deleteAll();
        repo.item.deleteAllReferences();
    })

    const expectFunction = (quotationLinks: QuotationLink[], payload: CreateWithAllData) => {
        for (let index = 0; index < quotationLinks.length; index++) {
            const quotation_link = quotationLinks[index];

            // verifica se os itens foram criados
            const itemReferenceData = repo.item.getReferenceById(quotation_link.item_reference_id);
            const itemVersionData = repo.item.getVersionById(quotation_link.item_version_id);

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
            if (payloadNotes !== undefined && payloadNotes !== "") {
                expect(itemReferenceData?.notes).toBe(payloadNotes);
            } else {
                expect(itemReferenceData?.notes ?? null).toBe(null);
            }

            // verifica os links de referência do item
            const payloadLinks = payload.items[index].reference_links ?? [];
            if (payloadLinks.length) {
                const referenceLinks = db.prepare(`
                    SELECT content FROM reference_links
                    WHERE item_reference_id = ?
                    ORDER BY id ASC
                `).all(quotation_link.item_reference_id) as { content: string }[];

                for (let linkIndex = 0; linkIndex < payloadLinks.length; linkIndex++) {
                    expect(referenceLinks[linkIndex]?.content).toBe(payloadLinks[linkIndex].content);
                }
            }

            //verifica os valores do item criado

            // 3.7 verifica se a posição é a mesma informada
            expect(itemVersionData?.position).toBe(payload.items[index].item_version.position);

            // 3.8 verifica se a quantidade é a mesma informada
            expect(itemVersionData?.quantity).toBe(payload.items[index].item_version.quantity);

            // 3.9 verifica se o preço unitário é o mesmo informado
            expect(itemVersionData?.unit_price).toBe(payload.items[index].item_version.unit_price);

            // 3.10 verifica se o markup é o mesmo informado
            if (payload.items[index].item_version.markup !== null && payload.items[index].item_version.markup !== undefined) {
                expect(itemVersionData?.markup).toBe(payload.items[index].item_version.markup);
            } else {
                expect(itemVersionData?.markup).toBe(null);
            }

            // 3.11 verifica se o frete de compra é o mesmo informado
            if (payload.items[index].item_version.purchase_shipping !== null && payload.items[index].item_version.purchase_shipping !== undefined) {
                expect(itemVersionData?.purchase_shipping).toBe(payload.items[index].item_version.purchase_shipping);
            } else {
                expect(itemVersionData?.purchase_shipping).toBe(null);
            }

            // 3.12 verifica se o ipi é o mesmo informado
            if (payload.items[index].item_version.ipi !== null && payload.items[index].item_version.ipi !== undefined) {
                expect(itemVersionData?.ipi).toBe(payload.items[index].item_version.ipi);
            } else {
                expect(itemVersionData?.ipi).toBe(null);
            }

            // 3.13 verifica se o st é o mesmo informado
            if (payload.items[index].item_version.st !== null && payload.items[index].item_version.st !== undefined) {
                expect(itemVersionData?.st).toBe(payload.items[index].item_version.st);
            } else {
                expect(itemVersionData?.st).toBe(null);
            }

            // 3.14 verifica se o valor extra é o mesmo informado
            if (payload.items[index].item_version.extra_value !== null && payload.items[index].item_version.extra_value !== undefined) {
                expect(itemVersionData?.extra_value).toBe(payload.items[index].item_version.extra_value);
            } else {
                expect(itemVersionData?.extra_value).toBe(null);
            }

            // 3.15 verifica se o embarque é o mesmo informado
            if (payload.items[index].item_version.boarding !== null && payload.items[index].item_version.boarding !== undefined) {
                expect(itemVersionData?.boarding).toBe(payload.items[index].item_version.boarding);
            } else {
                expect(itemVersionData?.boarding).toBe(null);
            }
        }
    }

    it("ter sucesso ao criar items com e sem links e valores", async () => {
        // 1. prepara o payload
        const payload: CreateWithAllData = {
            client: { ...fakeClients[0] },
            items: [
                {
                    item_reference: { ...fakeItens[0], notes: "Cabo para instalação interna" },
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
            quotation: { amount: 12, total_value: 431.32, status: 1 }
        }

        // 2. envia a requisição
        const response = services.quotation.createWithItems(payload);

        if (!response.success) {
            throw new Error("Falha ao criar cotação com itens: " + response.data);
        };

        const quotationLinks = response.data;

        expectFunction(quotationLinks, payload);
    });

    it("ter sucesso ao criar items que já existem no banco de dados", async () => {
        const itemPayload = fakeItens[1];

        const itemId = repo.item.createReference(itemPayload);

        // 1. prepara o payload
        const payload: CreateWithAllData = {
            client: { ...fakeClients[0] },
            items: [
                {
                    item_reference: { ...fakeItens[1], id: itemId },
                    reference_links: [],
                    item_version: fakeItemVersion(0, {
                        ipi: 1.3,
                        boarding: "EXW",
                    }),
                },
                {
                    item_reference: { ...fakeItens[1], id: itemId },
                    reference_links: [],
                    item_version: fakeItemVersion(1, {
                        quantity: 22,
                        unit_price: 43,
                        ipi: 1.3,
                        extra_value: 10,
                    }),
                }
            ],
            quotation: { amount: 2, total_value: 431.32, status: 1 }
        }

        // 2. envia a requisição
        const response = services.quotation.createWithItems(payload);

        if (!response.success) {
            throw new Error("Falha ao criar cotação com itens: " + response.data);
        };

        const quotationLinks = response.data;

        expectFunction(quotationLinks, payload);
    });
});
