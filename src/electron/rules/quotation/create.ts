// utils
import { success, failure } from "../../utils/handleSuccess.js";

export interface CreateQuotationRuleInput {
    notes?: string;
    amount: number;
    total_value: number;
    itemsCount: number;
}

export const rulesCode = {
    AMOUNT_NOT_INFORMED: "Quantidade de itens não informado",
    TOTAL_VALUE_NOT_INFORMED: "Total do orçamento não informado",
    AMOUNT_MISMATCH: "A quantidade de itens informada não corresponde ao número de itens enviados",
}

const DEFAULT_STATUS = 0;

/** valida a cotação para "encapsular" os dados */
const create = ({ notes, amount, total_value, itemsCount }: CreateQuotationRuleInput) => {
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

    const data: Quotation = {
        notes: notesData.length !== 0 ? notesData : undefined,
        status: DEFAULT_STATUS,
        amount,
        total_value
    }

    return success(data);
};

export default create;
