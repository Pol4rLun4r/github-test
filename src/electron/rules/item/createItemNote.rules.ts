import { success, failure } from "../../utils/handleSuccess.js";

export interface CreateItemNoteRules extends CreateItemNote {
    itemReferenceIdExists: number | undefined
}

const createItemNoteRules = ({ notes, item_reference_id, itemReferenceIdExists }: CreateItemNoteRules) => {
    if (!itemReferenceIdExists) {
        return failure("item_reference_id não existe ou não foi informado");
    }

    const trimmedNotes = (notes ?? "").trim();

    if (!trimmedNotes) {
        return failure("Conteúdo não foi informado");
    }

    return success({
        item_reference_id,
        notes: trimmedNotes,
    });
}

export default createItemNoteRules;
