// types
import type { Database } from "better-sqlite3";

// repositories
import { createRepositories } from "../../repositories/index.js";

// rules
import { createRules } from "../../rules/index.js";

// utils
import { success } from "../../utils/handleSuccess.js";

const getReferenceLinksService = (db: Database) => {
    const repo = createRepositories(db);
    const rules = createRules();

    return db.transaction((item_reference_id: GetReferenceLinks) => {
        const itemReferenceExists = repo.item.reference.getById(item_reference_id) !== undefined ? true : false;

        const result = rules.item.getReferenceLinks({ item_reference_id, itemReferenceExists });

        if (!result.success) {
            return result;
        }

        const reference_links = repo.item.referenceLinks.getByReferenceId(result.data);
        return success(reference_links);
    });
};

export default getReferenceLinksService;