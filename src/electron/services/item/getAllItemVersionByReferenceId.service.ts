// utils
import { success } from "../../utils/handleSuccess.js";

// repositories
import { createRepositories } from "../../repositories/index.js";

// types
import { Database } from "better-sqlite3";

// rules
import getAllItemVersionReferenceIdRules from '../../rules/item/getAllItemVersionByReferenceId.rules.js';

const getAllItemVersionReferenceIdService = (db: Database) => {
    const repo = createRepositories(db);

    return db.transaction((item_reference_id: ItemVersion['item_reference_id']) => {
        const referenceIdExists = repo.item.getReferenceById(item_reference_id)?.id;

        const result = getAllItemVersionReferenceIdRules({ item_reference_id, referenceIdExists });

        // any errors
        if (!result.success) {
            return result;
        }

        const versions = repo.item.getAllVersionByReferenceId(result.data)

        return success(versions);
    });
};

export default getAllItemVersionReferenceIdService;