// utils
import { failure, success } from "../../utils/handleSuccess.js";

export interface GetItemValuesByIdRules {
    itemValuesExists: boolean;
    item_values_id: ItemValues["id"];
}

export const rulesCode = {
    ITEM_VALUES_ID_NOT_INFORMED: "item_values_id não informado",
    ITEM_VALUES_ID_INVALID: "O id do item_values é inválido",
    ITEM_VALUES_NOT_FOUND: (id: ItemValues["id"]) => `item_values com ID ${id} não encontrado.`,
};

/** valida se o item_values_id foi informado, é um id válido e existe no banco */
const getItemValuesByIdRules = ({ itemValuesExists, item_values_id }: GetItemValuesByIdRules) => {
    if (item_values_id === undefined || item_values_id === null) {
        return failure(rulesCode.ITEM_VALUES_ID_NOT_INFORMED);
    }

    if (!Number.isSafeInteger(item_values_id) || item_values_id <= 0) {
        return failure(rulesCode.ITEM_VALUES_ID_INVALID);
    }

    if (!itemValuesExists) {
        return failure(rulesCode.ITEM_VALUES_NOT_FOUND(item_values_id));
    }

    return success(item_values_id);
};

export default getItemValuesByIdRules;
