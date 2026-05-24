// utils
import { success, failure } from "../../utils/handleSuccess.js";

interface GetItemNotesRules {
    itemReferenceIdExists: number | undefined,
    item_reference_id: GetItemNotes
}

const getItemNotesRules = ({ itemReferenceIdExists, item_reference_id }: GetItemNotesRules) => {
    // check if item_reference_id exists in the database
    if (!itemReferenceIdExists) {
        return failure("ID da referência do item não existe");
    }

    return success(item_reference_id);
};

export default getItemNotesRules;