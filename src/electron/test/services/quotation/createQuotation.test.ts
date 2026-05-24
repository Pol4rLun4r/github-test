/// <reference types="vitest/globals" />

// service and repo
import { createDatabase } from "../../../db/connection.js";
import { createRepositories } from "../../../repositories/index.js";
import { createServices } from "../../../services/index.js";

// utils
import { getDBPath } from "../../../utils/pathResolver.js";
import { fakeClients } from "../../fakeClients.js";

describe("Create Quotation", () => {
    // criar banco de dados antes dos testes
    const db = createDatabase(getDBPath());
    const services = createServices(db);
    const repo = createRepositories(db);

    // preparar dados
    fakeClients.map((client) => {
        repo.client.create(client);
    });

    // função para verificar o sucesso da criação de uma cotação, sem precisar repetir o código em cada teste
    const expectCreateQuotation = (payload: CreateQuotation) => {
        const quotation = services.quotation.create(payload);

        if (!quotation.success) {
            throw new Error("Falha ao criar cotação: " + quotation.data);
        }

        const quotationId = quotation.data?.quotation_id;

        const quotationInDatabase = repo.client.getById(quotationId);

        // 3. verifica se houve o retorno correto
        expect(quotationId).toBe(quotationInDatabase?.id);
    };

    it('ter sucesso para criar uma nova cotação', () => {
        // 1. prepara os dados
        const clientId = repo.client.getById(1)?.id

        const payload: CreateQuotation = {
            client_id: clientId!,
            notes: 'hello world',
            status: undefined,
            amount: 12,
            total_value: 123.32
        };

        // 2. chama o serviço
        expectCreateQuotation(payload);
    });

    it('ter sucesso para criar uma nova cotação sem notas', async () => {
        // 1. prepara os dados
        const clientId = repo.client.getById(1)?.id

        const payload: CreateQuotation = {
            client_id: clientId!,
            notes: '',
            status: undefined,
            amount: 12,
            total_value: 123.32
        };

        // 2. chama o serviço
        expectCreateQuotation(payload);
    });

    // Teste para criar uma nova cotação sem status
    it('ter sucesso para criar uma nova cotação com status diferente', async () => {
        // 1. Prepara os dados
        const clientId = repo.client.getById(1)?.id

        const payload: CreateQuotation = {
            client_id: clientId!,
            notes: '',
            status: 1,
            amount: 12,
            total_value: 123.32
        };

        // 2. chama o serviço
        expectCreateQuotation(payload);
    });

    // Teste para falhar ao criar uma nova cotação sem um client_id válido
    it('falhar ao tentar criar uma nova cotação sem um client_id válido', async () => {
        // 1. Prepara os dados
        const payload: CreateQuotation = {
            client_id: 99999999,
            notes: 'Client',
            status: 0,
            amount: 12,
            total_value: 123.32
        };

        // 2. chama o serviço
        const quotation = services.quotation.create(payload);

        // 3. verifica se houve o retorno correto
        expect(quotation.data).toBe('Cliente não existe');
    });
});