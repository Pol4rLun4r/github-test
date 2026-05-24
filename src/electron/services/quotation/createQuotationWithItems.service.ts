// database
import type { Database } from "better-sqlite3";

// rules
import addItemRules from "../../rules/item/addItem.rules.js";
import createQuotationRules from "../../rules/quotation/createQuotation.rules.js";
import createClientRules, { cleanDocument } from "../../rules/client/createClient.rules.js";

// utils
import { success } from "../../utils/handleSuccess.js";

// repositories
import { createRepositories } from "../../repositories/index.js";

const createQuotationWithItems = (db: Database) => (payload: CreateWithAllData) => {
    const repo = createRepositories(db);

    // verifica se o cliente existe baseado no id do cliente (se informado)
    const clientExistsById = repo.client.getById(payload.client.id);

    // verifica se o cliente existe baseado no documento
    const clientExistsByDocument = repo.client.getByDocument(cleanDocument(payload.client.document));

    // validar regras para criar cliente
    const validateClient = createClientRules({
        clientExistsById,
        clientExistsByDocument,
        document: payload.client.document,
        name: payload.client.name,
        notes: payload.client.notes,
        type_client: payload.client.type_client
    });

    // client errors
    if (!validateClient.success) {
        return validateClient;
    };

    const hasClient = validateClient.code === 'CLIENT_EXISTS_BY_ID' || validateClient.code === 'CLIENT_EXISTS_BY_DOCUMENT';

    // id do cliente que será definido posteriormente
    let client_id: number

    if (hasClient) {
        // validar regras para criar cotação
        const data: Client = validateClient.data;
        client_id = data.id as number;
    } else {
        const data: Client = validateClient.data;
        // cria um cliente caso o mesmo não exista
        client_id = repo.client.create({ ...data })?.id as number
    };

    // validar regras para criar cotação
    const validadeQuotation = createQuotationRules({
        client_id,
        notes: payload.quotation.notes,
        status: payload.quotation.status,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        clientExists: client_id as any,
        amount: payload.quotation.amount,
        total_value: payload.quotation.total_value
    });

    // quotation errors
    if (!validadeQuotation.success) {
        return validadeQuotation;
    };

    // cria uma cotação e retorna o id da versão criada
    const quotationVersionId = repo.quotation.create({ ...validadeQuotation.data });

    // pega os dados da cotação pra ter certeza que ela existe
    const quotationVersionExists = repo.quotation.getByVersionId(quotationVersionId);

    // VERIFICAR SE UM ID DE UM ITEM EXISTE --------------------------------

    // validar regras para criar items
    const resultItems = addItemRules({
        quotation_version_id: quotationVersionId,
        // @ts-expect-error - precisa ajustar o tipo de items no payload para ser compatível com o que a regra espera
        items: payload.items,
        quotationVersionExists
    });

    // items errors
    if (!resultItems.success) {
        return resultItems;

        // COLOCAR FUNÇÃO PARA APAGAR COTAÇÃO CASO ALGUM ITEM DE PROBLEMA AO SER CRIADO --------------------------------
    }

    const added = repo.item.addToQuotation(
        resultItems.data.quotation_version_id,
        resultItems.data.items
    );

    return success(added);
};

export default createQuotationWithItems;
