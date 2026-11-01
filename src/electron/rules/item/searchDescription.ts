// utils
import { success, failure } from "../../utils/handleSuccess.js";

export const rulesCode = {
    DESCRIPTION_NOT_INFORMED: "Cada item deve ter uma descrição",
    DESCRIPTION_NOT_STRING: "A descrição deve ser uma string",
}

const searchDescriptionRules = (rawQuery: SearchItemDescription) => {
    // limpar espaços em branco no início e no final da string
    rawQuery = rawQuery.trim();

    // verificar se rawQuery é uma string
    if (typeof rawQuery !== "string") {
        return failure(rulesCode.DESCRIPTION_NOT_STRING);
    }

    // verificar se rawQuery não é uma string vazia
    if (rawQuery.trim().length <= 0) {
        return failure(rulesCode.DESCRIPTION_NOT_INFORMED);
    }

    return success(rawQuery);
};

export default searchDescriptionRules;