// database
import type { Database } from "better-sqlite3";

// utils
import { success, failure } from "../../utils/handleSuccess.js";

// repositories
import { createRepositories } from "../../repositories/index.js";

/** pegar resumo de todas as cotações (dados base) */
const getAllQuotationsSummary = (db: Database) => () => {
    const repo = createRepositories(db);

    const quotations = repo.quotation.base.getAllSummary();

    if (quotations === undefined) {
        return failure("Erro interno ao buscar cotações");
    }

    return success(quotations);
}

export default getAllQuotationsSummary;