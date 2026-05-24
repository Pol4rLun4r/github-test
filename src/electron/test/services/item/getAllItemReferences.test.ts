/// <reference types="vitest/globals" />

// service and repo
import { createDatabase } from "../../../db/connection.js";
import { createRepositories } from "../../../repositories/index.js";
import { createServices } from "../../../services/index.js";

// utils
import { getDBPath } from "../../../utils/pathResolver.js";
import { fakeItens } from "../../fakeItens.js";

describe("test search item all", () => {
    // criar banco de dados antes dos testes
    const db = createDatabase(getDBPath());
    const services = createServices(db);
    const repo = createRepositories(db);

    beforeAll(() => {
        // cria referencias fake para fim e testes
        for (let index = 0; index < fakeItens.length; index++) {
            const item = fakeItens[index];
            repo.item.createReference(item);
        }
    })

    test("pesquisando item", () => {
        // 1. prepara os dados
        const payload: SearchItemDescriptionIsOptional = "flexivel";

        // 2. faz a requisição
        services.item.getAllBySearch(payload);

        // 3. verifica se a requisição teve exito
        // console.log(res.data);
    })

    test("sem pesquisa de item", () => {
        // 1. prepara os dados
        const payload: SearchItemDescriptionIsOptional = " ";

        // 2. faz a requisição
        services.item.getAllBySearch(payload);

        // 3. verifica se a requisição teve exito
    })
})