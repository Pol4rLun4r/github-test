// types
import type { Database } from "better-sqlite3";

// repositories
import { createRepositories } from "../../repositories/index.js";

// utils
import { success } from "../../utils/handleSuccess.js";

// rules
import searchClientsRules from "../../rules/client/searchClients.rules.js";

const searchClientsService = (db: Database) => {
    const repo = createRepositories(db);

    return db.transaction((data: SearchClient) => {
        const result = searchClientsRules(data);

        // any errors
        if (!result.success) {
            return result;
        }

        // if 'type' is 'document'
        if (result.code === 'DOCUMENT') {
            const value = result.data;
            return success(repo.client.searchByDocument(value))
        }

        // if 'type' is 'name'
        const value = result.data;
        return success(repo.client.searchByName(value));
    })
};

export default searchClientsService;