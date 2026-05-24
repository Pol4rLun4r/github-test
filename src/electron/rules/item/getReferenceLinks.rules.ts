// utils
import { success, failure } from "../../utils/handleSuccess.js";

interface GetReferenceLinksRules {
    itemReferenceIdExists: number | undefined;
    item_reference_id: GetReferenceLinks;
}

const getReferenceLinksRules = ({ itemReferenceIdExists, item_reference_id }: GetReferenceLinksRules) => {
    if (!itemReferenceIdExists) {
        return failure("ID da referência do item não existe");
    }

    return success(item_reference_id);
};

export default getReferenceLinksRules;
