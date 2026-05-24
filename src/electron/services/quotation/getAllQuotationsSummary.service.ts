// database

import type { Database } from "better-sqlite3";

// utils
import { success, failure } from "../../utils/handleSuccess.js";

// repositories
import { createRepositories } from "../../repositories/index.js";

const getAllQuotationsSummaryService = (db: Database) => () => {
    const repo = createRepositories(db);

    const quotations = repo.quotation.getAllSummary();

    if(!quotations) {
        return failure("Nenhuma cotação encontrada")
    }

    return success(quotations);
};

export default getAllQuotationsSummaryService;