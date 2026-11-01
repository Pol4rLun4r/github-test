import type { Database } from "better-sqlite3";

// utils
import { success, failure } from "../../utils/handleSuccess.js";

// rules
import { createRules } from "../../rules/index.js";

// repositories
import { createRepositories } from "../../repositories/index.js";

/** pega a cotação a partir do id de um item_values e retorna a cotação completa */
const getQuotationByItemValuesIdService = (db: Database) => {
    const repo = createRepositories(db);
    const rules = createRules();

    return db.transaction((item_values_id: ItemValues["id"]) => {
        const itemValuesExists = repo.item.values.getById(item_values_id as number) !== undefined;

        // verifica se o item_values existe
        const itemValuesResult = rules.item.getItemValuesById({ itemValuesExists, item_values_id });

        if (!itemValuesResult.success) {
            return itemValuesResult;
        }

        const link = repo.quotation.links.getByItemValuesId(itemValuesResult.data);

        if (!link) {
            return failure(`Nenhum vínculo de cotação encontrado para item_values ${itemValuesResult.data}.`);
        }

        const quotationExists = repo.quotation.base.getById(link.quotation_id) !== undefined;

        // verifica se a cotação existe
        const quotationResult = rules.quotation.getFull({
            quotationExists,
            quotation_id: link.quotation_id,
        });

        if (!quotationResult.success) {
            return quotationResult;
        }

        // pega a cotação completa
        const quotation = repo.workFlows.getQuotationFull(quotationResult.data);

        if (!quotation) {
            return failure("Cotação não encontrada.");
        }

        return success(quotation);
    });
};

export default getQuotationByItemValuesIdService;
