// api
import { baseAPI } from "./path";

const searchDescription = async (query: SearchItemDescription) => {
    const response = await baseAPI.item.searchDescription(query);
    return response;
};

const getReferenceLinks = async (item_reference_id: GetReferenceLinks) => {
    const response = await baseAPI.item.getReferenceLinks(item_reference_id);
    return response;
};

const findItemReferences = async (query: SearchItemDescriptionIsOptional) => {
    const response = await baseAPI.item.findItemReferences(query);
    return response;
};

const getAllValuesByReferenceId = async (referenceId: GetByReferenceId) => {
    const response = await baseAPI.item.getAllValuesByReferenceId(referenceId);
    return response;
};

export default { searchDescription, getReferenceLinks, findItemReferences, getAllValuesByReferenceId };