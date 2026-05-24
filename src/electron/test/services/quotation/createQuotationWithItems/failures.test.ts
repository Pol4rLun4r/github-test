/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vitest/globals" />

// service and repo
import { createDatabase } from "../../../../db/connection.js";
import { createRepositories } from "../../../../repositories/index.js";
import { createServices } from "../../../../services/index.js";

// utils
import { getDBPath } from "../../../../utils/pathResolver.js";
import { fakeItens } from "../../../fakeItens.js";
import { fakeClients } from "../../../fakeClients.js";

describe("Failures - Create Quotation and Add Items", () => {

    // testes para verificar a criação ou uso do cliente
    describe("Client", () => {
        // criar banco de dados antes dos testes
        const db = createDatabase(getDBPath());
        const services = createServices(db);
        const repo = createRepositories(db);

        // apaga os clientes a cada teste
        afterEach(() => {
            repo.client.deleteAll();
        })

        it("falha ao criar um cliente para cotação, por ausência de nome", async () => {
            // 1. prepara o payload
            const payload: CreateWithAllData = {
                client: { ...fakeClients[0], name: "" },
                items: {} as any,
                quotation: {} as any
            }

            // 2. envia a requisição
            const quotation = services.quotation.createWithItems(payload);

            // 3. verifica o resultado
            expect(quotation.success).toBe(false);
            expect(quotation.data).toBe("Nome é obrigatório");
        });

        it("falha ao criar um cliente para cotação, por ausência de documento", async () => {
            // 1. prepara o payload
            const payload: CreateWithAllData = {
                client: { ...fakeClients[0], document: "" },
                items: {} as any,
                quotation: {} as any
            }

            // 2. envia a requisição
            const quotation = services.quotation.createWithItems(payload);

            // 3. verifica o resultado
            expect(quotation.success).toBe(false);
            expect(quotation.data).toBe("Documento é obrigatório");
        });

        it("falha ao criar um cliente para cotação, ao informar um documento inválido", async () => {

            // 1. prepara o payload
            const payload: CreateWithAllData = {
                client: { ...fakeClients[0], document: "123" },
                items: {} as any,
                quotation: {} as any
            }

            // 2. envia a requisição
            const quotation = services.quotation.createWithItems(payload);

            // 3. verifica o resultado
            expect(quotation.success).toBe(false);
            expect(quotation.data).toBe("Informe um documento válido");
        });

        it("falha ao criar um cliente para cotação, quando o tipo do cliente não é informado corretamente", async () => {

            // 1. prepara o payload
            const payload: CreateWithAllData = {
                client: { ...fakeClients[0], type_client: "invalid_type" as any },
                items: {} as any,
                quotation: {} as any
            }

            // 2. envia a requisição
            const quotation = services.quotation.createWithItems(payload);

            // 3. verifica o resultado
            expect(quotation.success).toBe(false);
            expect(quotation.data).toBe("Por favor, especifique o tipo do cliente. Internacional ou Nacional");
        });
    });

    // teste para verificar a criação da cotação
    describe("Quotation", () => {
        // criar banco de dados antes dos testes
        const db = createDatabase(getDBPath());
        const services = createServices(db);
        const repo = createRepositories(db);

        // apaga os clientes a cada teste
        afterEach(() => {
            repo.client.deleteAll();
        })

        it("falhar se o cliente não existir", async () => {

            // 1. prepara o payload
            const payload: CreateWithAllData = {
                client: {} as any,
                items: {} as any,
                quotation: {} as any
            }

            // 2. envia a requisição
            const quotation = services.quotation.createWithItems(payload);

            // 3. verifica o resultado
            // como nenhum cliente foi informado, retorna ao tentar criar um cliente no fluxo de criação de cotação + items
            expect(quotation.success).toBe(false);
            expect(quotation.data).toBe("Nome é obrigatório");
        });
    });

    // teste para verificar a adição/criação de items
    describe("Add Items", () => {
        // criar banco de dados antes dos testes
        const db = createDatabase(getDBPath());
        const services = createServices(db);
        const repo = createRepositories(db);

        // apaga os clientes a cada teste
        afterEach(() => {
            repo.client.deleteAll();
        })


        it("falhar se não tiver ao menos um item", async () => {

            // 1. prepara o payload
            const payload: CreateWithAllData = {
                client: fakeClients[0],
                items: [],
                quotation: { amount: 12, total_value: 431.32, status: 1 }
            }

            // 2. envia a requisição
            const quotation = services.quotation.createWithItems(payload);

            // 3. verifica o resultado
            expect(quotation.success).toBe(false);
            expect(quotation.data).toBe("Informe ao menos um item");
        });

        it("falhar se o item não tiver uma posição/ordem", async () => {

            // 1. prepara o payload
            const payload: CreateWithAllData = {
                client: fakeClients[0],
                items: [
                    {
                        item_reference: { ...fakeItens[0] },
                        reference_links: [],
                        item_version: {
                            quantity: 2,
                            unit_price: 2,
                            position: undefined as any,
                        }
                    }
                ],
                quotation: { amount: 12, total_value: 431.32, status: 1 }
            }

            // 2. envia a requisição
            const quotation = services.quotation.createWithItems(payload);

            // 3. verifica o resultado
            expect(quotation.success).toBe(false);
            expect(quotation.data).toBe("Cada item deve ter uma posição/ordem");
        });

        it("falhar se mais de um item tem a mesma posição/ordem", async () => {
            // 1. prepara o payload
            const payload: CreateWithAllData = {
                client: {
                    name: "polaroid-san",
                    document: "20039966054",
                    notes: "novo cliente",
                    type_client: "nacional"
                },
                items: [
                    {
                        item_reference: { ...fakeItens[0] },
                        reference_links: [],
                        item_version: {
                            quantity: 2,
                            unit_price: 2,
                            position: 1,
                        }
                    },
                    {
                        item_reference: { ...fakeItens[0] },
                        reference_links: [],
                        item_version: {
                            quantity: 2,
                            unit_price: 2,
                            position: 1,
                        }
                    },
                ],
                quotation: { amount: 12, total_value: 431.32, status: 1 }
            }

            // 2. envia a requisição
            const quotation = services.quotation.createWithItems(payload);

            // 3. verifica o resultado
            expect(quotation.success).toBe(false);
            expect(quotation.data).toBe(`${payload.items.length} items tem o mesmo numero de posição: ${payload.items[1].item_version.position}`);
        });

        it("falhar se o item não tiver uma descrição", async () => {
            // 1. prepara o payload
            const payload: CreateWithAllData = {
                client: {
                    name: "polaroid-san",
                    document: "20039966054",
                    notes: "novo cliente",
                    type_client: "nacional"
                },
                items: [
                    {
                        item_reference: { ...fakeItens[0], description: "" },
                        reference_links: [],
                        item_version: {
                            quantity: 2,
                            unit_price: 2,
                            position: 0,
                        }
                    }
                ],
                quotation: { amount: 12, total_value: 431.32, status: 1 }
            }

            // 2. envia a requisição
            const quotation = services.quotation.createWithItems(payload);

            // 3. verifica o resultado
            expect(quotation.success).toBe(false);
            expect(quotation.data).toBe("Cada item deve ter uma descrição");
        });
    });
});