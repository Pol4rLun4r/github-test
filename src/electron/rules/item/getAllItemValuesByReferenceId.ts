// utils
import { failure, success } from "../../utils/handleSuccess.js";

interface GetAllItemValuesByReferenceIdRules {
    referenceIdExists: boolean;
    item_reference_id: ItemValues['item_reference_id'];
}

export const rulesCode = {
    ITEM_REFERENCE_NOT_INFORMED: "item_reference_id não informado",
    ITEM_REFERENCE_NOT_EXISTS: "item_reference_id não existe"
}

const getAllItemValuesByReferenceIdRules = ({ referenceIdExists, item_reference_id }: GetAllItemValuesByReferenceIdRules) => {
    if(!item_reference_id) return failure(rulesCode.ITEM_REFERENCE_NOT_INFORMED);

    if(!referenceIdExists) return failure(rulesCode.ITEM_REFERENCE_NOT_EXISTS);

    return success(item_reference_id);
};

export default getAllItemValuesByReferenceIdRules;