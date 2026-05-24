// utils
import { success } from "../../utils/handleSuccess.js";

// repositories
import { createRepositories } from "../../repositories/index.js";

// types
import { Database } from "better-sqlite3";

// rules
import getAllItemReferenceBySearchRules from "../../rules/item/getAllItemReferenceBySearch.rules.js";

const getAllItemReferenceBySearchService = (db: Database) => {
    const repo = createRepositories(db);

    return db.transaction((rawQuery: SearchItemDescriptionIsOptional) => {
        const result = getAllItemReferenceBySearchRules(rawQuery);

        // any errors
        if (!result.success) {
            return result;
        }

        // se não houver buscar, pegar todos os itens
        if(result.code === 'GET_ALL') {
            const allItems = repo.item.getAllItemReferences();
            return success(allItems);
        }

        const itemsSearched = repo.item.searchByDescription(result.data!)

        return success(itemsSearched);
    });
}

export default getAllItemReferenceBySearchService;