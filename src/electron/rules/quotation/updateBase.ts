// utils
import { success, failure } from "../../utils/handleSuccess.js";

export interface UpdateQuotationRuleInput extends UpdateQuotationData {
    itemsCount: number;
    quotationExists: boolean;
}

export const rulesCode = {
    AMOUNT_NOT_INFORMED: "Quantidade de itens não informado",
    TOTAL_VALUE_NOT_INFORMED: "Total do orçamento não informado",
    AMOUNT_MISMATCH: "A quantidade de itens informada não corresponde ao número de itens enviados",
    QUOTATION_ID_NOT_INFORMED: "ID da cotação não informado.",
    QUOTATION_NOT_FOUND: (id: Quotation['id']) => `Cotação com ID ${id} não encontrada.`,
}

const updateBase = ({
    id,
    status,
    notes,
    amount,
    total_value,
    itemsCount,
    quotationExists,  
}: UpdateQuotationRuleInput) => {

    // valida se o id foi informado
    if (!id) {
        return failure(rulesCode.QUOTATION_ID_NOT_INFORMED);
    }

    // validar se a cotação existe
    if (!quotationExists) {
        return failure(rulesCode.QUOTATION_NOT_FOUND(id));
    }

    // validar quantidade
    if (amount === undefined || amount === null) {
        return failure(rulesCode.AMOUNT_NOT_INFORMED);
    }

    // validar valor total
    if (total_value === undefined || total_value === null) {
        return failure(rulesCode.TOTAL_VALUE_NOT_INFORMED);
    }

    // validar se amount corresponde à quantidade de itens enviados
    if (amount !== itemsCount) {
        return failure(rulesCode.AMOUNT_MISMATCH);
    }

    // validar nota
    const notesData = (notes ?? "").trim();

    // validar status
    const statusData = status ?? 0;

    const data: UpdateQuotationData = {
        id,
        notes: notesData.length !== 0 ? notesData : undefined,
        status: statusData,
        amount,
        total_value,
    }

    return success(data);
};

export default updateBase;