// api
import { baseAPI } from './path';

const create = async (data: CreateQuotation) => {
    const response = await baseAPI.quotation.create(data);
    return response;
}

const getAllSummary = async () => {
    const response = await baseAPI.quotation.getAllSummary();
    return response;
}

const getFull = async (quotationId: Quotation['id']) => {
    const response = await baseAPI.quotation.getFull(quotationId);
    return response;
};

const update = async (quotation: UpdateQuotation) => {
    const response = await baseAPI.quotation.update(quotation);
    return response;
}

export default { create, getAllSummary, getFull, update };