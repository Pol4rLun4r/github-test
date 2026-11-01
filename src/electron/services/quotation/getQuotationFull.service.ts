import type { Database } from "better-sqlite3";

// utils
import { success, failure } from "../../utils/handleSuccess.js";

// rules
import { createRules } from "../../rules/index.js";

// repositories
import { createRepositories } from "../../repositories/index.js";

/** pegar cotação completa */
const getQuotationFullService = (db: Database) => {
    const repo = createRepositories(db);
    const rules = createRules();

    return db.transaction((quotation_id: Quotation['id']) => {
        const quotationExists = repo.quotation.base.getById(quotation_id) !== undefined ? true : false;

        const result = rules.quotation.getFull({ quotationExists, quotation_id });

        // any errors
        if (!result.success) {
            return result;
        }

        const quotation = repo.workFlows.getQuotationFull(result.data);

        if (!quotation) {
            return failure("Cotação não encontrada.");
        }

        return success(quotation);
    });
};

export default getQuotationFullService;