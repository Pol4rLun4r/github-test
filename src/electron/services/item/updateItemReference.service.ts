import type { Database } from "better-sqlite3";
import { createRepositories } from "../../repositories/index.js";
import { createRules } from "../../rules/index.js";
import { rulesCode } from "../../rules/item/updateItemReference.js";
import { failure, success } from "../../utils/handleSuccess.js";

const updateItemReferenceService = (db: Database) => {
    const repo = createRepositories(db);
    const rules = createRules();

    return db.transaction((payload: UpdateItemReferencePayload) => {
        const itemReferenceId = payload.item_reference.id;

        if (!Number.isSafeInteger(itemReferenceId) || itemReferenceId === undefined || itemReferenceId <= 0) {
            return failure(rulesCode.ITEM_REFERENCE_ID_INVALID);
        }

        const existingReference = repo.item.reference.getById(itemReferenceId);
        const validation = rules.item.updateItemReference({
            payload,
            itemReferenceExists: existingReference !== undefined,
            existingReferenceLinks: existingReference?.reference_links ?? [],
        });

        if (!validation.success) return failure(validation.data, validation.code);

        const updatedReference = repo.workFlows.updateItemReference(validation.data);
        if (!updatedReference) {
            return failure(rulesCode.ITEM_REFERENCE_NOT_FOUND(itemReferenceId));
        }

        return success(updatedReference);
    });
};

export default updateItemReferenceService;
