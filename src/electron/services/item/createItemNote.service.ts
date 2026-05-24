// types
import type { Database } from "better-sqlite3";

// rules
import createItemNoteRules from "../../rules/item/createItemNote.rules.js";
import { success } from "../../utils/handleSuccess.js";

// repositories
import { createRepositories } from "../../repositories/index.js";

const createItemNoteService = (db: Database) => {
    const repo = createRepositories(db);

    return db.transaction((data: CreateItemNote) => {
        const itemReferenceIdExists = repo.item.getReferenceById(data.item_reference_id)?.id;

        const result = createItemNoteRules({ itemReferenceIdExists, ...data });

        if (!result.success) {
            return result;
        }

        const itemReferenceId = repo.item.updateReferenceNotes(
            result.data.item_reference_id,
            result.data.notes
        );

        return success(itemReferenceId);
    });
};

export default createItemNoteService;
