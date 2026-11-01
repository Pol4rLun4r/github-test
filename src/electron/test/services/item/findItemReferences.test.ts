/// <reference types="vitest/globals" />

// service and repo
import { createDatabase } from "../../../db/connection.js";
import { createRepositories } from "../../../repositories/index.js";
import { createServices } from "../../../services/index.js";

// utils
import { getDBPath } from "../../../utils/pathResolver.js";
import { fakeItens } from "../../fakeItens.js";

describe("Pegar referências de itens", () => {
    // criar banco de dados antes dos testes
    const db = createDatabase(getDBPath());
    const services = createServices(db);
    const repo = createRepositories(db);

    beforeAll(() => {
        // cria referencias fake para fim e testes
        for (let index = 0; index < fakeItens.length; index++) {
            const item = fakeItens[index];
            repo.item.reference.create(item);
        }
    })

    test("sucesso ao pesquisar o item", () => {
        // 1. prepara os dados
        const payload: SearchItemDescriptionIsOptional = "flexivel";

        // 2. faz a requisição
        const res = services.item.findItemReferences(payload);

        // 3. verifica se a requisição teve exito
         if (!res.success) throw new Error("Falha ao buscar itens: " + res.data);

        expect(res.data).toHaveLength(2);
        expect(res.data[0].description).toEqual(fakeItens[0].description);
        expect(res.data[1].description).toEqual(fakeItens[1].description);
    })

    test("sucesso ao retornar todos quando não há termo de busca", () => {
        // 1. prepara os dados
        const payload: SearchItemDescriptionIsOptional = " ";

        // 2. faz a requisição
        const res = services.item.findItemReferences(payload);

        // 3. verifica se a requisição teve exito
        expect(res.success).toBe(true);
        expect(res.data).toHaveLength(fakeItens.length);
    })
})