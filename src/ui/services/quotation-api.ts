// api
import { baseAPI } from './path';

const create = async (data: CreateQuotation) => {
    const response = await baseAPI.quotation.create(data);
    return response;
}

const createWithItems = async (data: CreateWithAllData) => {
    const response = await baseAPI.quotation.createWithItems(data);
    return response;
}

const getAllSummary = async () => {
    const response = await baseAPI.quotation.getAllSummary();
    return response;
}

const getFullDetail = async (quotationId: Quotation['id']) => {
    const response = await baseAPI.quotation.getFullDetail(quotationId);
    return response;
};

export default { create, createWithItems, getAllSummary, getFullDetail };