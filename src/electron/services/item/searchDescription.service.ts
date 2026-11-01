// utils
import { success } from "../../utils/handleSuccess.js";

// repositories
import { createRepositories } from "../../repositories/index.js";

// types
import { Database } from "better-sqlite3";

// rules
import { createRules } from "../../rules/index.js";

const searchDescriptionService = (db: Database) => {
    const repo = createRepositories(db);
    const rules = createRules();

    return db.transaction((rawQuery: SearchItemDescription) => {
        const result = rules.item.searchDescription(rawQuery);

        // any errors
        if (!result.success) {
            return result;
        }

        return success(repo.item.reference.searchByDescription(result.data));
    });
}

export default searchDescriptionService;