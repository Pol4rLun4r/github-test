/// <reference types="vitest/globals" />

// service and repo
import { createDatabase } from "../../../db/connection.js";
import { createRepositories } from "../../../repositories/index.js";
import { createServices } from "../../../services/index.js";

// utils
import { getDBPath } from "../../../utils/pathResolver.js";
import { fakeItens } from "../../fakeItens.js";

describe("Search Item Description", () => {
    // criar banco de dados antes dos testes
    const db = createDatabase(getDBPath());
    const services = createServices(db);
    const repo = createRepositories(db);

    beforeAll(() => {
        // cria referências de itens para os testes
        repo.item.createReference(fakeItens[0]); // cabo
        repo.item.createReference(fakeItens[1]); // cabo
        repo.item.createReference(fakeItens[3]); // porca
    });

    it("ter sucesso quando pesquisar sobre a descrição de um item e ter um retorno com e sem acento", () => {
        // 1. prepara os dados
        const payload: SearchItemDescription = "flexivel";

        // 2. faz a requisição
        const res = services.item.searchDescription(payload);

        // 3. verifica se a requisição teve exito
        if (!res.success) throw new Error("Falha ao buscar itens: " + res.data);

        expect(res.data).toHaveLength(2);

        expect(res.data[0].description).toEqual(fakeItens[0].description);
        expect(res.data[1].description).toEqual(fakeItens[1].description);
    });

    // teste para ter sucesso quando pesquisar mais especificamente por uma descrição
    it("ter sucesso quando pesquisar mais especificamente por uma descrição", () => {
        // 1. prepara os dados
        const payload: SearchItemDescription = "Cabo flexivel preto";

        // 2. faz a requisição
        const res = services.item.searchDescription(payload);

        // 3. verifica se a requisição teve exito
        if (!res.success) throw new Error("Falha ao buscar itens: " + res.data);

        expect(res.data).toHaveLength(1);

        expect(fakeItens[1].description).toBe(res.data[0].description);
    });

    // teste para falhar caso nenhum valor seja informado    
    it("falhar caso nenhum valor seja informado", async () => {
        // 1. prepara os dados
        const payload: SearchItemDescription = " ";

        // 2. faz a requisição
        const res = services.item.searchDescription(payload);

        // 3. verifica se a requisição teve exito
        expect(res.data).toBe("Nenhum valor informado");
    });
});

