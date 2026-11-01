// database
import type { Database } from "better-sqlite3";

// rules
import { createRules } from "../../rules/index.js";

// utils
import { success } from "../../utils/handleSuccess.js";

// repositories
import { createRepositories } from "../../repositories/index.js";

/** criar cotação (completa) */
const createQuotation = (db: Database) => (payload: CreateQuotation) => {
    const repo = createRepositories(db);
    const rules = createRules();

    // validar regras para criar cotação
    const validateQuotation = rules.quotation.create({
        notes: payload.quotation.notes,
        amount: payload.quotation.amount,
        total_value: payload.quotation.total_value,
        itemsCount: payload.items.length,
    });

    // quotation errors
    if (!validateQuotation.success) {
        return validateQuotation;
    };

    // criar casca da cotação no banco de dados
    const quotation = repo.quotation.base.create(validateQuotation.data);

    // validar regras para criar items
    const validateItems = rules.item.createAndAdd({
        // @ts-expect-error - precisa ajustar o tipo de items no payload para ser compatível com o que a regra espera
        items: payload.items,
        quotationExists: quotation !== undefined ? true : false
    });

    // items errors
    if (!validateItems.success) {
        repo.quotation.base.deleteById({ id: quotation?.id as number }); // caso dê erro na criação dos items, deleta a cotação que foi criada
        return validateItems;
    }

    const added = repo.workFlows.addItemToQuotation(
        quotation!.id!,
        validateItems.data.items
    );

    return success(added);
};

export default createQuotation;
