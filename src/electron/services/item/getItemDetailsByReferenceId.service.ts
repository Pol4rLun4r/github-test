// types
import type { Database } from "better-sqlite3";

// repositories
import { createRepositories } from "../../repositories/index.js";

// rules
import { createRules } from "../../rules/index.js";

// utils
import { success } from "../../utils/handleSuccess.js";

const getItemDetailsByReferenceIdService = (db: Database) => {
    const repo = createRepositories(db);
    const rules = createRules();

    return db.transaction((item_reference_id: ItemValues["item_reference_id"]) => {
        const itemWithReferenceLinks = repo.item.reference.getById(item_reference_id);
        if (!itemWithReferenceLinks) {
            return rules.item.getItemDetailsByReferenceId({
                item_reference_id,
                referenceIdExists: false,
            });
        }

        const result = rules.item.getItemDetailsByReferenceId({
            item_reference_id,
            referenceIdExists: true,
        });

        if (!result.success) {
            return result;
        }

        const latest_price = repo.item.values.getLatestByReferenceId(result.data);
        const item_values_records = repo.item.values.countByReferenceId(result.data);

        return success({
            item_with_reference_links: itemWithReferenceLinks,
            item_values_records,
            latest_price,
        });
    });
};

export default getItemDetailsByReferenceIdService;