import { failure, success } from "../../utils/handleSuccess.js";

export type ValidatedItemValues = Pick<ItemValues, "position" | "quantity">
    & Partial<Omit<ItemValues, "position" | "quantity" | "created_at" | "updated_at">>;

export interface ValidateItemValuesInput {
    itemValues: Partial<ItemValues>;
}

export const rulesCode = {
    INVALID_ID: "O ID dos valores do item é inválido.",
    INVALID_ITEM_REFERENCE_ID: "O ID da referência do item é inválido.",
    INVALID_POSITION: "A posição deve ser um número inteiro maior ou igual a zero.",
    INVALID_QUANTITY: "A quantidade deve ser um número inteiro.",
    INVALID_NUMBER: (field: string) => `O campo ${field} deve ser um número válido.`,
    INVALID_MARKUP: "O campo markup deve ser um texto válido.",
    INVALID_BOARDING: "O campo boarding deve ser um número inteiro.",
    INVALID_DELIVERY: "O campo delivery deve ser um número inteiro maior ou igual a zero.",
};

// função auxiliar para validar se um ID opcional é um número inteiro positivo ou não informado (undefined ou null)
const isValidOptionalId = (id?: number | null) =>
    id === undefined || id === null || (Number.isSafeInteger(id) && id > 0);

const validateItemValues = ({ itemValues }: ValidateItemValuesInput) => {

    // valida se os IDs são números inteiros positivos ou não informados
    if (!isValidOptionalId(itemValues.id)) {
        return failure(rulesCode.INVALID_ID);
    }

    // valida se o ID da referência do item é um número inteiro positivo ou não informado
    if (!isValidOptionalId(itemValues.item_reference_id)) {
        return failure(rulesCode.INVALID_ITEM_REFERENCE_ID);
    }

    const position = itemValues.position;

    // valida se a posição é um número inteiro maior ou igual a zero
    if (typeof position !== "number" || !Number.isSafeInteger(position) || position < 0) {
        return failure(rulesCode.INVALID_POSITION);
    }

    // define a quantidade como 1 se não for informada, caso contrário, valida se é um número inteiro
    const quantity = itemValues.quantity ?? 1;

    // valida se a quantidade é um número inteiro
    if (typeof quantity !== "number" || !Number.isSafeInteger(quantity)) {
        return failure(rulesCode.INVALID_QUANTITY);
    }

    const numericFields = {
        unit_price: itemValues.unit_price,
        purchase_shipping: itemValues.purchase_shipping,
        ipi: itemValues.ipi,
        st: itemValues.st,
        extra_value: itemValues.extra_value,
    };

    // valida se os campos numéricos são números válidos (não NaN, não Infinity) caso sejam informados
    for (const [field, value] of Object.entries(numericFields)) {
        if (value !== undefined && value !== null && (typeof value !== "number" || !Number.isFinite(value))) {
            return failure(rulesCode.INVALID_NUMBER(field));
        }
    }

    // valida se o campo markup é uma string caso seja informado
    if (itemValues.markup !== undefined && itemValues.markup !== null && typeof itemValues.markup !== "string") {
        return failure(rulesCode.INVALID_MARKUP);
    }

    // valida se o campo boarding é um número inteiro caso seja informado
    if (itemValues.boarding !== undefined && itemValues.boarding !== null
        && (typeof itemValues.boarding !== "number" || !Number.isSafeInteger(itemValues.boarding))) {
        return failure(rulesCode.INVALID_BOARDING);
    }

    // valida se o campo delivery é um número inteiro caso seja informado
    if (itemValues.delivery !== undefined && itemValues.delivery !== null
        && (typeof itemValues.delivery !== "number" || !Number.isSafeInteger(itemValues.delivery) || itemValues.delivery < 0)) {
        return failure(rulesCode.INVALID_DELIVERY);
    }

    // cria o objeto ValidatedItemValues com os campos validados e normalizados, removendo espaços em branco do markup e convertendo campos vazios para undefined
    const data: ValidatedItemValues = {
        id: itemValues.id ?? undefined,
        item_reference_id: itemValues.item_reference_id ?? undefined,
        position,
        quantity,
        unit_price: itemValues.unit_price ?? undefined,
        markup: itemValues.markup?.trim() || undefined,
        purchase_shipping: itemValues.purchase_shipping ?? undefined,
        ipi: itemValues.ipi ?? undefined,
        st: itemValues.st ?? undefined,
        extra_value: itemValues.extra_value ?? undefined,
        boarding: itemValues.boarding ?? undefined,
        delivery: itemValues.delivery ?? undefined,
    };

    return success({ itemValues: data });
};

export default validateItemValues;