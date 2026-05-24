// types
import type { Database } from "better-sqlite3";

// rules
import createQuotationRules from "../../rules/quotation/createQuotation.rules.js";
import { success } from "../../utils/handleSuccess.js";

// repositories
import { createRepositories } from "../../repositories/index.js";

const createQuotationService = (db: Database) => {
    const repo = createRepositories(db);

    return db.transaction((data: CreateQuotation) => {
        const clientExists = repo.client.getById(data?.client_id);

        const result = createQuotationRules({clientExists, ...data});

        // any errors
        if(!result.success) {
            return result;
        }

        const createQuotation = repo.quotation.create(result.data);

        const quotation = repo.quotation.getByVersionId(createQuotation);

        return success(quotation);
    });
};

export default createQuotationService;