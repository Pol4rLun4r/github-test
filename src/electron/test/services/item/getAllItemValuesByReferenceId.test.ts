/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vitest/globals" />

// service and repo
import { createDatabase } from "../../../db/connection.js";
import { createRepositories } from "../../../repositories/index.js";
import { createServices } from "../../../services/index.js";

// rules
import { rulesCode } from "../../../rules/item/getAllItemValuesByReferenceId.js";

// utils
import { getDBPath } from "../../../utils/pathResolver.js";
import { fakeItens, fakeItemValues } from "../../fakeItens.js";

describe("Pegar todas os valores de um item por referência", () => {
    const db = createDatabase(getDBPath());
    const services = createServices(db);
    const repo = createRepositories(db);

    beforeAll(() => {
        // Limpa todas as referências existentes
        repo.item.reference.deleteAll();
    });

    afterAll(() => {
        // Limpa os dados após os testes
        repo.item.reference.deleteAll();
    });

    describe("Casos de sucesso", () => {
        test("retorna todos os valores de um item que existe", () => {
            // 1. Prepara os dados - cria uma referência e valores
            const itemReference = fakeItens[0];
            const itemReferenceId = repo.item.reference.create(itemReference);

            // Adiciona múltiplos valores ao item
            const value1 = fakeItemValues(1, { quantity: 2, unit_price: 10.5 });
            const value2 = fakeItemValues(2, { quantity: 5, unit_price: 20.0 });

            const insert = db.prepare(`
                INSERT INTO item_values (item_reference_id, position, quantity, unit_price, markup, purchase_shipping, ipi, st, extra_value, boarding)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            insert.run(itemReferenceId, value1.position, value1.quantity, value1.unit_price, undefined, undefined, undefined, undefined, undefined, undefined);
            insert.run(itemReferenceId, value2.position, value2.quantity, value2.unit_price, undefined, undefined, undefined, undefined, undefined, undefined);

            // 2. Faz a requisição
            const res = services.item.getAllItemValuesByReferenceId(itemReferenceId);

            // 3. Verifica se a requisição teve êxito
            expect(res.success).toBe(true);
            
            if (!res.success) throw new Error("Falha ao buscar valores: " + res.data);
            
            expect(res.data).toBeDefined();
            expect(Array.isArray(res.data)).toBe(true);
            expect(res.data).toHaveLength(2);

            // Verifica os dados dos valores retornados
            expect(res.data[0].item_reference_id).toBe(itemReferenceId);
            expect(res.data[0].position).toBe(2);
            expect(res.data[0].quantity).toBe(5);
            expect(res.data[0].unit_price).toBe(20.0);

            expect(res.data[1].item_reference_id).toBe(itemReferenceId);
            expect(res.data[1].position).toBe(1);
            expect(res.data[1].quantity).toBe(2);
            expect(res.data[1].unit_price).toBe(10.5);
        });

        test("retorna array vazio quando item existe mas não tem valores", () => {
            // 1. Prepara os dados - cria uma referência sem valores
            const itemReference = fakeItens[1];
            const itemReferenceId = repo.item.reference.create(itemReference);

            // 2. Faz a requisição
            const res = services.item.getAllItemValuesByReferenceId(itemReferenceId);

            // 3. Verifica se a requisição teve êxito
            expect(res.success).toBe(true);
            
            if (!res.success) throw new Error("Falha ao buscar valores: " + res.data);
            
            expect(res.data).toBeDefined();
            expect(Array.isArray(res.data)).toBe(true);
            expect(res.data).toHaveLength(0);
        });

        test("retorna os valores mais recentes primeiro", () => {
            // 1. Prepara os dados
            const itemReference = fakeItens[2];
            const itemReferenceId = repo.item.reference.create(itemReference);

            const insert = db.prepare(`
                INSERT INTO item_values (item_reference_id, position, quantity, unit_price, markup, purchase_shipping, ipi, st, extra_value, boarding)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            // Adiciona valores em ordem
            for (let i = 1; i <= 3; i++) {
                const value = fakeItemValues(i, { quantity: i, unit_price: i * 5 });
                insert.run(itemReferenceId, value.position, value.quantity, value.unit_price, undefined, undefined, undefined, undefined, undefined, undefined);
            }

            // 2. Faz a requisição
            const res = services.item.getAllItemValuesByReferenceId(itemReferenceId);

            // 3. Verifica se estão em ordem
            expect(res.success).toBe(true);
            
            if (!res.success) throw new Error("Falha ao buscar valores: " + res.data);
            
            expect(res.data).toHaveLength(3);

            // Verifica a sequência do mais recente para o mais antigo
            for (let i = 0; i < 3; i++) {
                expect(res.data[i].position).toBe(3 - i);
                expect(res.data[i].quantity).toBe(3 - i);
            }
        });
    });

    describe("Casos de falha", () => {
        test("falha quando item_reference_id não é informado", () => {
            // 1. Prepara os dados com valor inválido
            const itemReferenceId: any = null;

            // 2. Faz a requisição
            const res = services.item.getAllItemValuesByReferenceId(itemReferenceId);

            // 3. Verifica se falhou corretamente
            expect(res.success).toBe(false);
            expect(res.data).toBe(rulesCode.ITEM_REFERENCE_NOT_INFORMED);
        });

        test("falha quando item_reference_id é undefined", () => {
            // 1. Prepara os dados com valor inválido
            const itemReferenceId: any = undefined;

            // 2. Faz a requisição
            const res = services.item.getAllItemValuesByReferenceId(itemReferenceId);

            // 3. Verifica se falhou corretamente
            expect(res.success).toBe(false);
            expect(res.data).toBe(rulesCode.ITEM_REFERENCE_NOT_INFORMED);
        });

        test("falha quando item_reference_id é zero", () => {
            // 1. Prepara os dados com valor inválido
            const itemReferenceId: any = 0;

            // 2. Faz a requisição
            const res = services.item.getAllItemValuesByReferenceId(itemReferenceId);

            // 3. Verifica se falhou corretamente
            expect(res.success).toBe(false);
            expect(res.data).toBe(rulesCode.ITEM_REFERENCE_NOT_INFORMED);
        });

        test("falha quando item_reference_id não existe", () => {
            // 1. Prepara os dados com um ID que não existe
            const nonExistentId = 99999;

            // 2. Faz a requisição
            const res = services.item.getAllItemValuesByReferenceId(nonExistentId);

            // 3. Verifica se falhou corretamente
            expect(res.success).toBe(false);
            expect(res.data).toBe(rulesCode.ITEM_REFERENCE_NOT_EXISTS);
        });

        test("falha com ID negativo", () => {
            // 1. Prepara os dados com ID negativo
            const itemReferenceId = -1;

            // 2. Faz a requisição
            const res = services.item.getAllItemValuesByReferenceId(itemReferenceId);

            // 3. Verifica se falhou corretamente
            expect(res.success).toBe(false);
            expect(res.data).toBe(rulesCode.ITEM_REFERENCE_NOT_EXISTS);
        });
    });
})