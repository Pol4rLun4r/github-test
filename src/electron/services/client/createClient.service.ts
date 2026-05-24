// types
import type { Database } from "better-sqlite3";

// repositories
import { createRepositories } from "../../repositories/index.js";

// rules
import createClientRules, { cleanDocument } from "../../rules/client/createClient.rules.js";

// utils
import { success } from "../../utils/handleSuccess.js";

const createClientService = (db: Database) => {
    const repo = createRepositories(db);

    return db.transaction((data: Client) => {
        const clientExistsByDocument = repo.client.getByDocument(cleanDocument(data.document))

        const result = createClientRules({ clientExistsByDocument, ...data });

        // any errors
        if (!result.success) {
            return result;
        }

        // se o cliente existir baseado no documento
        if (result.code === 'CLIENT_EXISTS_BY_DOCUMENT') {
            return result;
        }

        const createdClient = repo.client.create(result.data);

        return success(createdClient);
    });
};

export default createClientService;