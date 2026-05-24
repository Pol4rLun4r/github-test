// utils
import { failure, success } from "../../utils/handleSuccess.js";

interface GetAllItemVersionReferenceIdRules {
    referenceIdExists: number | undefined
    item_reference_id: ItemVersion['item_reference_id'];
}

const getAllItemVersionReferenceIdRules = ({ referenceIdExists, item_reference_id }: GetAllItemVersionReferenceIdRules) => {
    // verifica se o id existe
    if(!referenceIdExists) return failure('item_reference_id não existe');

    return success(item_reference_id);
};

export default getAllItemVersionReferenceIdRules;