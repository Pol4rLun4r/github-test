// utils
import { success } from "../../utils/handleSuccess.js";

// repositories
import { createRepositories } from "../../repositories/index.js";

// types
import { Database } from "better-sqlite3";

// rules
import { createRules } from "../../rules/index.js";

const findItemReferences = (db: Database) => {
    const repo = createRepositories(db);
    const rules = createRules();

    return db.transaction((rawQuery: SearchItemDescriptionIsOptional) => {
        const result = rules.item.findItemReferences(rawQuery);

        // any errors
        if (!result.success) {
            return result;
        }

        // se não houver buscar, pegar todos os itens
        if (result.code === 'GET_ALL') {
            const allItems = repo.item.reference.getAll();
            return success(allItems);
        }

        // se houver buscar, buscar os itens com a descrição informada
        const itemsSearched = repo.item.reference.searchByDescription(result.data!);

        return success(itemsSearched);
    });
}

export default findItemReferences;