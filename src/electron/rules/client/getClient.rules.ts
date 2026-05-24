// utils
import { failure, success } from "../../utils/handleSuccess.js";

interface GetClientData {
    client_id: number;
    clientExists: Client | undefined;
}

const getClientRules = ({ clientExists, client_id }: GetClientData) => {
    // check if client_id is empty
    if (!client_id) {
        return failure('Cliente ID não informado');
    }

    // check if client exists
    if (!clientExists) {
        return failure('Cliente não existe');
    }

    return success(client_id);
}

export default getClientRules;