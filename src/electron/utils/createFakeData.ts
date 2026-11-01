import type { Database } from "better-sqlite3";

// utils
import { isDev } from "./env.js"
import { createRepositories } from "../repositories/index.js";
import { fakeItens } from "../test/fakeItens.js";
import { createServices } from "../services/index.js";

const createRandomQuotationPayload = (itemReferences: ItemReference[]): CreateQuotation => {
    const itemCount = Math.floor(Math.random() * 5) + 1;

    const items = Array.from({ length: itemCount }, (_, position) => {
        const itemReference = itemReferences[Math.floor(Math.random() * itemReferences.length)];
        const quantity = Math.floor(Math.random() * 5) + 1;
        const unitPrice = Number((Math.random() * 100 + 1).toFixed(2));

        return {
            item_reference: { ...itemReference },
            item_values: {
                quantity,
                unit_price: unitPrice,
                position
            },
            reference_links: []
        };
    });

    const totalValue = Number(
        items.reduce((sum, item) => sum + item.item_values.quantity * item.item_values.unit_price, 0).toFixed(2)
    );

    return {
        items,
        quotation: {
            amount: items.length,
            total_value: totalValue,
            notes: `Orçamento aleatório ${Math.floor(Math.random() * 1000)}`
        }
    };
};

export const createFakeData = (db: Database) => {
    if (!isDev()) return;

    const repo = createRepositories(db);
    const services = createServices(db);

    const fakeReferenceLinks = [
        { content: 'https://mantine.dev/llms/getting-started.md' },
        { content: 'https://mantine.dev/llms/error-page.md' },
    ];

    // Cria itens falsos
    const itemReferences = fakeItens.map((item) => {
        const itemReferenceId = repo.item.reference.create(item);
        fakeReferenceLinks.forEach((link) => {
            repo.item.referenceLinks.create(itemReferenceId, { ...link, item_reference_id: itemReferenceId });
        });

        return { ...item, id: itemReferenceId };
    });

    // Cria falsos orçamentos
    for (let index = 0; index < 50; index++) {
        const result = services.quotation.create(createRandomQuotationPayload(itemReferences));

        if (!result.success) {
            throw new Error(`Falha ao criar orçamento falso: ${result.data}`);
        }
    }
}
