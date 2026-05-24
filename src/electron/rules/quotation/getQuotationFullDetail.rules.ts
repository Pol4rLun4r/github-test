// utils
import { success, failure } from "../../utils/handleSuccess.js";

export interface GetQuotationFullDetailRules {
    quotationExists?: Quotation | undefined;
    quotation_id: Quotation['id'];
};

const getQuotationFullDetailRules = ({ quotation_id, quotationExists }: GetQuotationFullDetailRules) => {
    if (!quotationExists) {
        return failure('Orçamento não existe');
    }

    return success(quotation_id!);
};

export default getQuotationFullDetailRules;