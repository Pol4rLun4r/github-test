import type { Database } from "better-sqlite3";

import { createRepositories } from "../../repositories/index.js";
import { createRules } from "../../rules/index.js";
import { rulesCode } from "../../rules/item/getItemValuesById.js";
import { failure, success } from "../../utils/handleSuccess.js";

const getItemValuesByIdService = (db: Database) => {
    const repo = createRepositories(db);
    const rules = createRules();

    return db.transaction((item_values_id: ItemValues["id"]) => {
        const idResult = rules.item.getItemValuesById({
            itemValuesExists: true,
            item_values_id,
        });

        if (!idResult.success) {
            return idResult;
        }

        const itemValues = repo.item.values.getById(idResult.data);
        if (!itemValues) {
            return failure(rulesCode.ITEM_VALUES_NOT_FOUND(idResult.data));
        }

        return success(itemValues);
    });
};

export default getItemValuesByIdService;
