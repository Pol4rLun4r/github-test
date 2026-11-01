// utils
import { success, failure } from "../../utils/handleSuccess.js";

export const rulesCode = {
    ITEM_REFERENCE_ID_NOT_INFORMED: "ID da referência do item não informado.",
    ITEM_REFERENCE_NOT_FOUND: (id: ItemReference['id']) => `Referência do item com ID ${id} não encontrada.`,
}

interface GetReferenceLinksRules {
    itemReferenceExists: boolean;
    item_reference_id: GetReferenceLinks;
}

const getReferenceLinksRules = ({ itemReferenceExists, item_reference_id }: GetReferenceLinksRules) => {
    if (!item_reference_id) {
        return failure(rulesCode.ITEM_REFERENCE_ID_NOT_INFORMED);
    }

    if (!itemReferenceExists) {
        return failure(rulesCode.ITEM_REFERENCE_NOT_FOUND(item_reference_id));
    }

    return success(item_reference_id);
};

export default getReferenceLinksRules;