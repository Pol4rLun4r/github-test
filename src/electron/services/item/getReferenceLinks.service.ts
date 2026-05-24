// types
import type { Database } from "better-sqlite3";

// repositories
import { createRepositories } from "../../repositories/index.js";

// rules
import getReferenceLinksRules from "../../rules/item/getReferenceLinks.rules.js";

// utils
import { success } from "../../utils/handleSuccess.js";

const getReferenceLinksService = (db: Database) => {
    const repo = createRepositories(db);

    return db.transaction((item_reference_id: GetReferenceLinks) => {
        const itemReferenceIdExists = repo.item.getReferenceById(item_reference_id)?.id;

        const result = getReferenceLinksRules({ item_reference_id, itemReferenceIdExists });

        if (!result.success) {
            return result;
        }

        const reference_links = repo.item.getReferenceLinksByReferenceId(result.data);
        return success(reference_links);
    });
};

export default getReferenceLinksService;
