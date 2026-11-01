// utils
import { success } from "../../utils/handleSuccess.js";

// repositories
import { createRepositories } from "../../repositories/index.js";

// types
import { Database } from "better-sqlite3";

// rules
import { createRules } from "../../rules/index.js";

const getAllItemValuesByReferenceIdService = (db: Database) => {
    const repo = createRepositories(db);
    const rules = createRules();

    return db.transaction((item_reference_id: ItemValues['item_reference_id']) => {
        const referenceIdExists = repo.item.reference.getById(item_reference_id) !== undefined ? true : false;

        const result = rules.item.getAllItemValuesByReferenceId({ item_reference_id, referenceIdExists });

        // any errors
        if (!result.success) {
            return result;
        }

        const values = repo.item.values.getAllByReferenceId(result.data)

        return success(values);
    });
};

export default getAllItemValuesByReferenceIdService;