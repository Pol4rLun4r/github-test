// utils
import { success, failure } from "../../utils/handleSuccess.js";

export interface GetFullQuotationRuleInput {
    quotationExists: boolean;
    quotation_id: Quotation['id'];
}

export const rulesCode = {
    QUOTATION_ID_NOT_INFORMED: "ID da cotação não informado.",
    QUOTATION_NOT_FOUND: (id: Quotation['id']) => `Cotação com ID ${id} não encontrada.`,
}

/** valida a busca a busca de dados, para saber se a cotação existe */
const getFull = ({ quotationExists, quotation_id }: GetFullQuotationRuleInput) => {

    // valida se o id foi informado
    if (!quotation_id) {
        return failure(rulesCode.QUOTATION_ID_NOT_INFORMED);
    }

    // validar se a cotação existe
    if (!quotationExists) {
        return failure(rulesCode.QUOTATION_NOT_FOUND(quotation_id));
    }

    return success(quotation_id);
}

export default getFull;