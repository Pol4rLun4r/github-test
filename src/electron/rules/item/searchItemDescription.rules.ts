// utils
import { success, failure } from "../../utils/handleSuccess.js";

const searchItemDescriptionRules = (rawQuery: SearchItemDescription) => {
    // check if rawQuery is a string
    if (typeof rawQuery !== "string") {
        return failure("Por favor, informe uma string");
    }

    // check if rawQuery is empty
    if (rawQuery.trim().length <= 0) {
        return failure("Nenhum valor informado");
    }

    return success(rawQuery);
};

export default searchItemDescriptionRules;