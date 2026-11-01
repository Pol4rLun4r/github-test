// utils
import { failure, success } from "../../utils/handleSuccess.js";

interface GetItemDetailsByReferenceIdRules {
    item_reference_id: ItemValues["item_reference_id"];
    referenceIdExists: boolean;
}

export const rulesCode = {
    ITEM_REFERENCE_ID_NOT_INFORMED: "ID da referência do item não informado.",
    ITEM_REFERENCE_NOT_FOUND: (id: ItemValues["item_reference_id"]) =>
        `Referência do item com ID ${id} não encontrada.`,
};

function getItemDetailsByReferenceIdRules(
    { item_reference_id, referenceIdExists }: GetItemDetailsByReferenceIdRules & { referenceIdExists: false }
): FailureResponse;
function getItemDetailsByReferenceIdRules(
    input: GetItemDetailsByReferenceIdRules & { referenceIdExists: true }
): Result<ItemValues["item_reference_id"]>;
function getItemDetailsByReferenceIdRules({
    item_reference_id,
    referenceIdExists,
}: GetItemDetailsByReferenceIdRules) {
    if (!item_reference_id) {
        return failure(rulesCode.ITEM_REFERENCE_ID_NOT_INFORMED);
    }

    if (!referenceIdExists) {
        return failure(rulesCode.ITEM_REFERENCE_NOT_FOUND(item_reference_id));
    }

    return success(item_reference_id);
}

export default getItemDetailsByReferenceIdRules;
