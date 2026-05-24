import type { Database } from "better-sqlite3";

// rules
import { success, failure } from "../../utils/handleSuccess.js";
import getQuotationFullDetailRules from '../../rules/quotation/getQuotationFullDetail.rules.js';

// repositories
import { createRepositories } from "../../repositories/index.js";

const getQuotationFullDetailService = (db: Database) => {

    const repo = createRepositories(db);

    return db.transaction((quotation_id: Quotation['id']) => {
        const quotationExists = repo.quotation.getById(quotation_id);

        const result = getQuotationFullDetailRules({ quotationExists, quotation_id });

        // any errors
        if (!result.success) {
            return result;
        }

        const quotation = repo.quotation.getFullDetail(result.data);

        if (!quotation) {
            return failure("Cotação não encontrada.");
        }

        return success(quotation);
    });
};

export default getQuotationFullDetailService;
