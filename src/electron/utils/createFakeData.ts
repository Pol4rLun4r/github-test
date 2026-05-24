import type { Database } from "better-sqlite3";

// utils
import { isDev } from "./env.js"
import { createRepositories } from "../repositories/index.js";
import { fakeItens } from "../test/fakeItens.js";
import { fakeClients } from "../test/fakeClients.js";
import { createServices } from "../services/index.js";

export const createFakeData = (db: Database) => {
    if (!isDev()) return;

    const repo = createRepositories(db);
    const services = createServices(db);

    const fakeReferenceLinks = [
        { content: 'https://mantine.dev/llms/getting-started.md' },
        { content: 'https://mantine.dev/llms/error-page.md' },
    ];

    // Cria itens falsos
    fakeItens.forEach((item) => {
        const itemReferenceId = repo.item.createReference(item);
        fakeReferenceLinks.forEach((link) => {
            repo.item.createReferenceLink(itemReferenceId, {...link, item_reference_id: itemReferenceId});
        });
    });

    // Cria clientes falsos
    fakeClients.forEach(client => {
        repo.client.create(client);
    });


    const payloadQuotation: CreateWithAllData = {
        client: { ...fakeClients[0] },
        items: [
            {
                item_reference: { ...fakeItens[0] },
                reference_links: [],
                item_version: {
                    quantity: 2,
                    unit_price: 2,
                    position: 0
                }
            },
            {
                item_reference: { ...fakeItens[0] },
                reference_links: [
                    { content: 'https://mantine.dev/llms/getting-started.md' }
                ],
                item_version: {
                    quantity: 2,
                    unit_price: 2,
                    position: 1
                }
            }
        ],
        quotation: { amount: 12, total_value: 431.32, status: 1, notes: "Hello World" }
    }

    // Cria falsos orçamentos
    for (let index = 0; index < 50; index++) {
        services.quotation.createWithItems(payloadQuotation);
    }
}