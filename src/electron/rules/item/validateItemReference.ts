import { failure, success } from "../../utils/handleSuccess.js";

type NewItemReference = Omit<ItemReference, "id" | "created_at" | "updated_at">;

export type ValidatedItemReference =
    | { type: "existing"; id: number }
    | { type: "new"; data: NewItemReference };

export interface ValidateItemReferenceInput {
    itemReference: Partial<ItemReference>;
}

export const rulesCode = {
    INVALID_ITEM_REFERENCE_ID: "O ID da referência do item é inválido.",
    DESCRIPTION_NOT_INFORMED: "A nova referência do item deve ter uma descrição.",
    INVALID_TEXT_FIELD: (field: string) => `O campo ${field} da referência do item deve ser um texto válido.`,
};

// função auxiliar para normalizar campos de texto opcionais, removendo espaços em branco e retornando undefined se o valor for vazio
const normalizeOptionalText = (value?: string | null) => value?.trim() || undefined;

// Valida e normaliza uma referência de item, também informa se é uma referência existente (com ID) ou nova (sem ID) 
const validateItemReference = ({ itemReference }: ValidateItemReferenceInput) => {
    const id = itemReference.id;

    // valida se o ID é um número inteiro positivo, caso seja informado
    if (id !== undefined) {
        if (!Number.isSafeInteger(id) || id <= 0) {
            return failure(rulesCode.INVALID_ITEM_REFERENCE_ID);
        }

        // se id existe, retorna sucesso com o tipo "existing" e o ID
        return success<ValidatedItemReference>({ type: "existing", id });
    }

    const description = itemReference.description;

    // valida se a descrição é uma string não vazia, caso seja uma nova referência (sem ID)
    if (typeof description !== "string" || !description.trim()) {
        return failure(rulesCode.DESCRIPTION_NOT_INFORMED);
    }

    const optionalFields = {
        internal_code: itemReference.internal_code,
        manufacturer_code: itemReference.manufacturer_code,
        ncm: itemReference.ncm,
        notes: itemReference.notes,
    };

    // valida se os campos opcionais são strings, caso sejam informados
    for (const [field, value] of Object.entries(optionalFields)) {
        if (value !== undefined && value !== null && typeof value !== "string") {
            return failure(rulesCode.INVALID_TEXT_FIELD(field));
        }
    }

    // cria e normaliza os campos da nova referência, removendo espaços em branco e convertendo campos vazios para undefined
    const data: NewItemReference = {
        description: description.trim(),
        internal_code: normalizeOptionalText(itemReference.internal_code),
        manufacturer_code: normalizeOptionalText(itemReference.manufacturer_code),
        ncm: normalizeOptionalText(itemReference.ncm),
        notes: normalizeOptionalText(itemReference.notes),
    };

    return success<ValidatedItemReference>({ type: "new", data });
};

export default validateItemReference;