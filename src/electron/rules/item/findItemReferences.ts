// utils
import { failure, success } from "../../utils/handleSuccess.js";

/** valida a busca e determina se tem um filtro de busca ou não */
const findItemReferencesRules = (rawQuery: SearchItemDescriptionIsOptional) => {

    // se for undefined o conteúdo de pesquisa, buscar todos os itens
    if (rawQuery === undefined) return success(rawQuery, 'GET_ALL');


    const queryCleaned = rawQuery.trim();

    // error?
    if (queryCleaned.length < -1) return failure('error?')
        

    // se não tiver nenhum character, buscar todos os itens
    if (queryCleaned.length <= 0) return success(rawQuery, 'GET_ALL');

    return success(rawQuery);
};

export default findItemReferencesRules;