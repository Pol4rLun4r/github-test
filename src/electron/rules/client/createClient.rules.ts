// utils
import { success, failure } from "../../utils/handleSuccess.js";
import { onlyNumbers, onlyName } from "../../utils/clean.js";
import { validateDocument } from "../../utils/documentValidator.js";

// types
interface CreateClient extends Omit<Client, "id"> {
    clientExistsByDocument?: Client | undefined
    clientExistsById?: Client | undefined
};

const createClientRules = ({ clientExistsById, clientExistsByDocument, document, name, notes, type_client }: CreateClient) => {
    const cleanedName = onlyName(name)
    const cleanedDocument = onlyNumbers(document);
    const cleanedTypeClient = onlyName(type_client as string);

    // verifica se cliente existe baseado no id
    if (clientExistsById) {
        return success(clientExistsById, 'CLIENT_EXISTS_BY_ID');
    }

    // verifica se cliente existe baseado no documento
    if (clientExistsByDocument) {
        return success(clientExistsByDocument, 'CLIENT_EXISTS_BY_DOCUMENT');
    }

    // checar se o nome existe
    if (cleanedName.length === 0) {
        return failure('Nome é obrigatório');
    }

    // checar se o documento existe
    if (cleanedDocument.length === 0) {
        return failure('Documento é obrigatório');
    }

    // checar se o documento é válido
    if (!validateDocument(cleanedDocument)) {
        return failure('Informe um documento válido');
    }

    // checar o tipo do cliente
    if (type_client !== 'internacional' && type_client !== 'nacional') {
        return failure('Por favor, especifique o tipo do cliente. Internacional ou Nacional')
    }

    const data: Client = {
        name: cleanedName,
        document: cleanedDocument,
        type_client: cleanedTypeClient as ClientType,
        notes: notes?.length !== 0 ? notes : undefined,
    }

    return success(data);
};

export const cleanDocument = (document: string | undefined) => {
    if(!document) return undefined;
    return onlyNumbers(document);
};

export default createClientRules;

