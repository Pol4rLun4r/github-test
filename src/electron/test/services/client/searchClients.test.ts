/// <reference types="vitest/globals" />

// service and repo
import { createDatabase } from "../../../db/connection.js";
import { createRepositories } from "../../../repositories/index.js";
import { createServices } from "../../../services/index.js";

// utils
import { getDBPath } from "../../../utils/pathResolver.js";
import { fakeClients } from "../../fakeClients.js";

const hasItems = (arr: unknown[]): boolean => {
    return arr.length > 0;
};

describe("Search Clients", () => {
    // criar banco de dados antes dos testes
    const db = createDatabase(getDBPath());
    const services = createServices(db);
    const repo = createRepositories(db);

    // Preparar dados
    fakeClients.map((client) => {
        repo.client.create(client);
    })

    it('ter sucesso ao buscar clientes pelo documento', async () => {

        // 1. Prepara os dados
        const payload: SearchClient = {
            type: 'document',
            value: '19'
        }

        // 2. Chama o serviço para buscar o cliente
        const clients = services.client.search(payload);

        if (!clients.success) throw new Error("Falha ao buscar clientes: " + clients.data);

        // 3. verifica se houve o retorno correto
        expect(hasItems(clients.data)).toBe(true);
    });

    it('ter sucesso ao buscar clientes pelo nome', async () => {

        // 1. Prepara os dados
        const payload: SearchClient = {
            type: 'name',
            value: 'a'
        }

        // 2. Chama o serviço para buscar o cliente
        const clients = services.client.search(payload);

        if (!clients.success) throw new Error("Falha ao buscar clientes: " + clients.data);

        // 3. verifica se houve o retorno correto
        expect(hasItems(clients.data)).toBe(true);
    });

    it('ter sucesso ao buscar clientes pelo nome e segundo nome', async () => {

        // 1. Prepara os dados
        const payload: SearchClient = {
            type: 'name',
            value: 'ana souza'
        }

        // 2. Chama o serviço para buscar o cliente
        const clients = services.client.search(payload);

        if (!clients.success) throw new Error("Falha ao buscar clientes: " + clients.data);

        // 3. verifica se houve o retorno correto
        expect(hasItems(clients.data)).toBe(true);
    });

    it('ter sucesso ao tentar buscar um cliente com documento contendo caracteres especiais', async () => {
        // 1. Prepara os dados
        const payload: SearchClient = {
            type: 'document',
            value: '20/ - (03 .. 9/ 966 054'
        }

        // 2. Chama o serviço para buscar o cliente
        const clients = services.client.search(payload);

        if (!clients.success) throw new Error("Falha ao buscar clientes: " + clients.data);

        // 3. verifica se houve o retorno correto (retorna o documento de um cliente especifico)
        expect(clients.data[0]?.document).toBe('20039966054');
    })

    it('falhar ao tentar buscar com um valor inválido', async () => {

        // 1. Prepara os dados
        const payload: SearchClient = {
            type: 'name',
            value: 'e23d1312d3d2d2d'
        }

        // 2. Chama o serviço para buscar o cliente
        const clients = services.client.search(payload);

        // 3. verifica se houve o retorno correto (falha)
        expect(clients.data).toBe('Busca inválida, não pode conter letras e números juntos');
    })

    it('falhar ao tentar buscar um cliente pelo documento e usar letras', async () => {

        // 1. Prepara os dados
        const payload: SearchClient = {
            type: 'document',
            value: 'a'
        }

        // 2. Chama o serviço para buscar o cliente
        const clients = services.client.search(payload);

        // 3. verifica se houve o retorno correto (falha)
        expect(clients.data).toBe("Não use nomes para buscar um documento");
    });

    it('falhar ao tentar buscar um cliente pelo nome e usar números', async () => {

        // 1. Prepara os dados
        const payload: SearchClient = {
            type: 'name',
            value: '1'
        }

        // 2. Chama o serviço para buscar o cliente
        const clients = services.client.search(payload);

        // 3. verifica se houve o retorno correto (falha)
        expect(clients.data).toBe("Não use números para buscar um nome");
    });

    it('falhar ao tentar buscar um cliente sem informar o valor de busca', async () => {

        // 1. Prepara os dados
        const payload: SearchClient = {
            type: 'document',
            value: ''
        }

        // 2. Chama o serviço para buscar o cliente
        const clients = services.client.search(payload);

        // 3. verifica se houve o retorno correto (falha)
        expect(clients.data).toBe("Nenhum valor informado");
    });

    it('falhar ao tentar buscar um cliente sem informar o tipo de busca', async () => {

        // 1. Prepara os dados
        const payload: SearchClient = {
            type: '' as 'name',
            value: '12'
        }

        // 2. Chama o serviço para buscar o cliente
        const clients = services.client.search(payload);

        // 3. verifica se houve o retorno correto (falha)
        expect(clients.data).toBe("Por favor, especifique o tipo da busca");
    });
});