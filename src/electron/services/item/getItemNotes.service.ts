// types
import type { Database } from "better-sqlite3";

// rules
import getItemNotesRules from "../../rules/item/getItemNotes.rules.js";

// utils
import { success } from "../../utils/handleSuccess.js";

// repositories
import { createRepositories } from "../../repositories/index.js";

const getItemNotesService = (db: Database) => {
    const repo = createRepositories(db);

    return db.transaction((item_reference_id: GetItemNotes) => {
        const itemReference = repo.item.getReferenceById(item_reference_id);
        const itemReferenceIdExists = itemReference?.id;

        const result = getItemNotesRules({ item_reference_id, itemReferenceIdExists });

        if (!result.success) {
            return result;
        }

        const notes = itemReference?.notes ?? undefined;
        return success(notes);
    });
};

export default getItemNotesService;
