// utils
import { success } from "../../utils/handleSuccess.js";

// repositories
import { createRepositories } from "../../repositories/index.js";

// types
import { Database } from "better-sqlite3";

// rules
import searchItemDescriptionRules from "../../rules/item/searchItemDescription.rules.js";

const searchItemDescriptionService = (db: Database) => {
    const repo = createRepositories(db);

    return db.transaction((rawQuery: SearchItemDescription) => {
        const result = searchItemDescriptionRules(rawQuery);

        // any errors
        if (!result.success) {
            return result;
        }

        return success(repo.item.searchByDescription(result.data));
    });
}

export default searchItemDescriptionService;