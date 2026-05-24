/// <reference types="vitest/globals" />

// service and repo
import { createDatabase } from "../../../db/connection.js";
import { createRepositories } from "../../../repositories/index.js";
import { createServices } from "../../../services/index.js";

// utils
import { normalizeDocument } from "../../../utils/clean.js";
import { getDBPath } from "../../../utils/pathResolver.js";
import { fakeClients } from "../../fakeClients.js";

// função para verificar se os dados do cliente enviados são os mesmo vindo do banco de dados
const expectClientMatchesRequest = (responseData: Client | undefined, requestData: Client) => {
    if (!responseData) {
        throw new Error("Cliente não retornou");
    }

    if (requestData.name?.trim()) {
        expect(requestData.name?.toLocaleLowerCase()).toBe(responseData.name); // verifica se os nomes batem
    }

    if (requestData.document !== undefined) {
        expect(normalizeDocument(requestData.document)).toBe(normalizeDocument(responseData.document)); // verifica se os documentos batem
    }

    if (requestData.type_client !== undefined) {
        expect(requestData.type_client?.toLocaleLowerCase()).toBe(responseData.type_client); // verifica se o tipo de cliente bate
    }

    if (requestData.notes !== undefined) {
        expect(requestData.notes).toBe(responseData.notes); // verifica se as notas batem
    }
};

describe('Create client', () => {
    // criar banco de dados antes dos testes
    const db = createDatabase(getDBPath());
    const services = createServices(db);
    const repo = createRepositories(db);

    // apaga os clientes a cada teste
    afterEach(() => {
        repo.client.deleteAll();
    })
    
    it('ter sucesso ao criar um novo cliente', () => {
        // 1. prepara o payload
        const payload = fakeClients[0];

        // 2. chama o serviço
        const client = services.client.create(payload);

        if (!client.success) {
            throw new Error("Falha ao criar cliente: " + client.data);
        }

        const getClientIdInDatabase = repo.client.getById(client.data?.id)?.id;

        // 3. verifica se houve o retorno correto
        expect(client.data?.id).toBe(getClientIdInDatabase); // verificar se o id do cliente criado é o mesmo presente no banco de dados
        expectClientMatchesRequest(client.data, payload);
    });

    it('ter sucesso ao criar um novo cliente, onde o documento é o mesmo, retornando o cliente existente', async () => {
        // 1. prepara o payload
        const payload = fakeClients[0];

        // 2. chama o serviço
        services.client.create(payload); // cria o cliente
        const client = services.client.create(payload); // recria o cliente

        if (!client.success) {
            throw new Error("Falha ao criar cliente: " + client.data);
        }
        const getClientIdInDatabase = repo.client.getById(client.data?.id)?.id;

        // 3. verifica se houve o retorno correto
        expect(client.data?.id).toBe(getClientIdInDatabase); // verificar se o id do cliente criado é o mesmo presente no banco de dados
        expect(normalizeDocument(payload.document)).toBe(client.data?.document); // verifica se o documento é o mesmo
    });

    it('falhar ao tentar criar um novo cliente sem um nome', async () => {
        // 1. prepara o payload
        const payload: Client = {
            ...fakeClients[0],
            name: ''
        };

        // 2. chama o serviço
        const client = services.client.create(payload);

        // 3. verifica se houve o retorno correto
        expect(client.data).toBe('Nome é obrigatório');
    });

    it('falhar ao tentar criar um novo cliente sem um documento', async () => {
        // 1. prepara o payload
        const payload: Client = {
            ...fakeClients[0],
            document: '',
        };

        // 2. chama o serviço
        const client = services.client.create(payload);

        // 3. verifica se houve o retorno correto
        expect(client.data).toBe('Documento é obrigatório');
    });

    it('falhar ao tentar criar um novo cliente sem um documento válido', async () => {
        // 1. prepara o payload
        const payload: Client = {
            ...fakeClients[0],
            document: '413123-12323-31234523',
        };

        // 2. chama o serviço
        const client = services.client.create(payload);

        // 3. verifica se houve o retorno correto
        expect(client.data).toBe('Informe um documento válido');
    });

    it('falhar ao tentar criar um novo cliente sem um tipo de cliente válido', async () => {
        // 1. prepara o payload
        const payload: Client = {
            ...fakeClients[0],
            type_client: 'abcdefg' as ClientType,
        };

        // 2. chama o serviço
        const client = services.client.create(payload);

        // 3. verifica se houve o retorno correto
        expect(client.data).toBe('Por favor, especifique o tipo do cliente. Internacional ou Nacional');
    });
})